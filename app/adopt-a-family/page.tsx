'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdoptAFamilyPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sponsorshipType, setSponsorshipType] = useState<'partial' | 'split'>('partial');
  const [friendEmails, setFriendEmails] = useState<string[]>(['']);
  const [splitMessage, setSplitMessage] = useState('');

  useEffect(() => {
    fetchFamilies();
  }, []);

  async function fetchFamilies() {
    const { data } = await supabase
      .from('adopt_a_family')
      .select(`
        *,
        charities (name, contact_email, auto_response_message)
      `)
      .in('status', ['available', 'partially_adopted'])
      .order('urgency_date', { ascending: true });

    if (data) setFamilies(data);
    setLoading(false);
  }

  async function handleAdoptFamily() {
    if (!donorEmail || !donorName || !donationAmount || !selectedFamily) return;

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setIsSubmitting(true);

    const { error: adoptionError } = await supabase
      .from('family_adoptions')
      .insert({
        family_id: selectedFamily.id,
        donor_name: donorName,
        donor_email: donorEmail,
        amount_committed: amount
      });

    if (adoptionError) {
      alert('Error processing adoption. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const newTotal = selectedFamily.amount_committed + amount;
    const isFullyAdopted = newTotal >= selectedFamily.estimated_cost;

    const { error: updateError } = await supabase
      .from('adopt_a_family')
      .update({
        amount_committed: newTotal,
        status: isFullyAdopted ? 'fully_adopted' : 'partially_adopted'
      })
      .eq('id', selectedFamily.id);

    if (updateError) {
      alert('Error updating family status.');
      setIsSubmitting(false);
      return;
    }

    const deadlineDate = new Date(selectedFamily.urgency_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: donorEmail,
        subject: `Thank you for sponsoring ${selectedFamily.family_name}! ✨`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px;">
            
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0;">✨ Thank You! ✨</h1>
              <p style="color: #ffffff; font-size: 18px; margin: 10px 0;">You're Making the Holidays Special</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); border-radius: 10px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
              <p style="font-size: 18px; margin: 0 0 15px 0; color: #2d3436;">You've committed to sponsoring:</p>
              <h2 style="font-size: 28px; font-weight: bold; color: #2d3436; margin: 0;">
                ${selectedFamily.family_name}
              </h2>
              <p style="font-size: 16px; color: #636e72; margin: 15px 0 0 0;">
                Family of ${selectedFamily.family_size} • Your contribution: $${amount}
              </p>
            </div>
            
            <div style="background-color: #fff3e6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fdcb6e;">
              <h3 style="color: #2d3436; margin-top: 0; font-size: 18px;">🎁 What This Family Needs:</h3>
              <p style="line-height: 1.6; color: #2d3436; font-size: 15px; margin: 10px 0;">
                ${selectedFamily.specific_needs}
              </p>
              ${selectedFamily.story ? `
                <p style="line-height: 1.6; color: #636e72; font-size: 14px; margin: 15px 0 0 0; font-style: italic; padding-top: 15px; border-top: 1px solid #ddd;">
                  "${selectedFamily.story}"
                </p>
              ` : ''}
            </div>
            
            <div style="background: linear-gradient(135deg, #ff7675 0%, #d63031 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; box-shadow: 0 4px 8px rgba(214, 48, 49, 0.3);">
              <h3 style="color: #ffffff; margin: 0 0 10px 0; font-size: 20px;">📅 IMPORTANT DEADLINE</h3>
              <p style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 10px 0;">
                ${deadlineDate}
              </p>
              <p style="color: #ffffff; font-size: 14px; margin: 10px 0 0 0;">
                Please drop off or ship gifts by this date to ensure the family receives them on time.
              </p>
            </div>
            
            <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #2d3436; margin-top: 0; font-size: 18px;">📍 Drop-Off & Shipping Information</h3>
              <p style="line-height: 1.6; color: #2d3436; font-size: 14px;">
                <strong>Organization:</strong> ${selectedFamily.charities.name}
              </p>
              ${selectedFamily.charities.auto_response_message ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                  <p style="line-height: 1.6; color: #2d3436; font-size: 14px;">
                    ${selectedFamily.charities.auto_response_message.replace(/\n/g, '<br>')}
                  </p>
                </div>
              ` : ''}
            </div>
            
            ${!isFullyAdopted && (selectedFamily.estimated_cost - newTotal > 0) ? `
              <div style="background-color: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="color: #667eea; font-weight: bold; margin: 0; font-size: 15px;">
                  💡 This family still needs $${selectedFamily.estimated_cost - newTotal} in support.
                </p>
                <p style="color: #636e72; margin: 10px 0 0 0; font-size: 13px;">
                  Share with friends who might want to help!
                </p>
              </div>
            ` : `
              <div style="background-color: #d5f4e6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <p style="color: #00b894; font-weight: bold; margin: 0; font-size: 16px;">
                  ✨ This family is now fully sponsored! ✨
                </p>
              </div>
            `}
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
              <p style="color: #636e72; margin: 5px 0; font-size: 14px;">Questions about your sponsorship?</p>
              <p style="color: #636e72; margin: 5px 0; font-size: 14px;">
                Contact ${selectedFamily.charities.name} at<br>
                <a href="mailto:${selectedFamily.charities.contact_email}" style="color: #667eea; text-decoration: none; font-weight: bold;">${selectedFamily.charities.contact_email}</a>
              </p>
              
              <div style="margin-top: 25px; padding: 15px; background-color: #fff3cd; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #856404;">
                  ⚠️ <strong>Don't see this email?</strong> Check your SPAM or Promotions folder.
                </p>
              </div>
              
              <p style="color: #999; font-size: 12px; margin-top: 20px;">
                Thank you for spreading joy through NeighborSOS! ✨<br>
                <a href="https://neighborsos.org" style="color: #667eea; text-decoration: none;">neighborsos.org</a>
              </p>
            </div>
          </div>
        `
      })
    });

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: selectedFamily.charities.contact_email,
        subject: `${isFullyAdopted ? '🎉 Family Fully Sponsored' : '✅ Partial Sponsorship'}: ${selectedFamily.family_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${isFullyAdopted ? '🎉 Great news! A family is fully sponsored!' : '✅ Good news! Someone is helping a family!'}</h2>
            
            <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); border-radius: 10px; padding: 20px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #2d3436;">Family: ${selectedFamily.family_name}</h3>
              <p><strong>Donor contribution:</strong> $${amount}</p>
              <p><strong>Total committed:</strong> $${newTotal} of $${selectedFamily.estimated_cost}</p>
              ${!isFullyAdopted ? `<p><strong>Still needed:</strong> $${selectedFamily.estimated_cost - newTotal}</p>` : `<p style="color: #00b894; font-weight: bold;">✓ Fully funded!</p>`}
            </div>
            
            <h3>Donor Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${donorName}</li>
              <li><strong>Email:</strong> ${donorEmail}</li>
            </ul>
            
            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0;">
              Your auto-response has been sent to the donor with your delivery/coordination instructions.
            </div>
            
            <p style="margin-top: 20px;"><strong>Important:</strong> The donor has been informed that gifts must be delivered by ${deadlineDate}.</p>
            
            <p>- NeighborSOS</p>
          </div>
        `
      })
    });

    // If split sponsorship, send invite emails to friends
    if (sponsorshipType === 'split' && friendEmails.length > 0) {
      const validFriendEmails = friendEmails.filter(email => email && email.includes('@'));
      
      for (const friendEmail of validFriendEmails) {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: friendEmail,
            subject: `${donorName} invited you to co-sponsor ${selectedFamily.family_name}! ✨`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px;">
                
                <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                  <h1 style="color: #ffffff; font-size: 28px; margin: 0;">You're Invited! ✨</h1>
                  <p style="color: #ffffff; font-size: 16px; margin: 10px 0;">Help sponsor a family for the holidays</p>
                </div>
                
                <p style="font-size: 16px; color: #2d3436; line-height: 1.6;">
                  Hi there!
                </p>
                
                <p style="font-size: 16px; color: #2d3436; line-height: 1.6;">
                  <strong>${donorName}</strong> is sponsoring <strong>${selectedFamily.family_name}</strong> (a family of ${selectedFamily.family_size}) this holiday season and invited you to join!
                </p>
                
                ${splitMessage ? `
                  <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                    <p style="font-style: italic; color: #2d3436; margin: 0; font-size: 15px;">
                      "${splitMessage}"
                    </p>
                  </div>
                ` : ''}
                
                <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); border-radius: 10px; padding: 20px; margin: 25px 0;">
                  <h3 style="margin-top: 0; color: #2d3436;">Family Details:</h3>
                  <p style="margin: 5px 0; color: #2d3436;"><strong>Family Size:</strong> ${selectedFamily.family_size} people</p>
                  <p style="margin: 5px 0; color: #2d3436;"><strong>Total Cost:</strong> $${selectedFamily.estimated_cost}</p>
                  <p style="margin: 5px 0; color: #2d3436;"><strong>Already Committed:</strong> $${newTotal} (including ${donorName}'s $${amount})</p>
                  <p style="margin: 5px 0; color: #667eea; font-weight: bold;"><strong>Still Needed:</strong> $${Math.max(0, selectedFamily.estimated_cost - newTotal)}</p>
                </div>
                
                <div style="background-color: #fff3e6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="margin-top: 0; color: #2d3436;">What they need:</h4>
                  <p style="color: #2d3436; margin: 0; font-size: 14px;">${selectedFamily.specific_needs}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://neighborsos.org/adopt-a-family" 
                     style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    View Family & Contribute
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #636e72; text-align: center; margin-top: 30px;">
                  Any amount helps! Join ${donorName} in making the holidays special for this family.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center;">
                  You received this invitation from ${donorName} via NeighborSOS<br>
                  <a href="https://neighborsos.org" style="color: #667eea; text-decoration: none;">neighborsos.org</a>
                </p>
              </div>
            `
          })
        });
      }
    }

    alert(`Thank you ${donorName}! You've committed $${amount} to help ${selectedFamily.family_name}.\n\nCheck your email (${donorEmail}) for next steps and the deadline.\n\n⚠️ Check your SPAM folder if you don't see it.`);

    await fetchFamilies();
    setSelectedFamily(null);
    setDonorName('');
    setDonorEmail('');
    setDonationAmount('');
    setSponsorshipType('partial');
    setFriendEmails(['']);
    setSplitMessage('');
    setIsSubmitting(false);
  }

  const getStatusColor = (family: any) => {
    const percentFunded = (family.amount_committed / family.estimated_cost) * 100;
    if (percentFunded >= 100) return '#00b894';
    if (percentFunded >= 50) return '#fdcb6e';
    return '#667eea';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
        <p className="text-white text-xl">Loading families...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2]">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full">
            <span className="text-white font-semibold text-sm uppercase tracking-wide">Holiday Season Program</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-[#2d3436] mb-4">
            Sponsor a Family
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            Make the Holidays Special for Local Families
          </p>
          <p className="text-lg text-gray-500">
            Support families celebrating any tradition this season ✨
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-serif text-[#2d3436] mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <p className="font-semibold mb-2">Browse Families</p>
              <p className="text-sm text-gray-600">View families in need this holiday season</p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#fdcb6e] to-[#e17055] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <p className="font-semibold mb-2">Choose Your Impact</p>
              <p className="text-sm text-gray-600">Sponsor fully or split with friends</p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#00b894] to-[#00cec9] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <p className="font-semibold mb-2">Deliver Joy</p>
              <p className="text-sm text-gray-600">Follow charity instructions to help</p>
            </div>
          </div>
        </div>

        {families.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-2xl text-gray-600 mb-4">✨ No families currently need sponsorship</p>
            <p className="text-gray-500">Check back soon or contact local charities to add families!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {families.map((family) => {
              const percentFunded = Math.min(100, (family.amount_committed / family.estimated_cost) * 100);
              const remaining = Math.max(0, family.estimated_cost - family.amount_committed);
              
              return (
                <div 
                  key={family.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="h-8 relative overflow-hidden" style={{
                    background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)'
                  }}>
                    <div className="absolute inset-0 flex items-center justify-around">
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 0 10px rgba(102, 126, 234, 0.6)',
                        animationDelay: '0s'
                      }}></div>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #fdcb6e 0%, #e17055 100%)',
                        boxShadow: '0 0 10px rgba(253, 203, 110, 0.6)',
                        animationDelay: '0.2s'
                      }}></div>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #00b894 0%, #00cec9 100%)',
                        boxShadow: '0 0 10px rgba(0, 184, 148, 0.6)',
                        animationDelay: '0.4s'
                      }}></div>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #ff7675 0%, #d63031 100%)',
                        boxShadow: '0 0 10px rgba(255, 118, 117, 0.6)',
                        animationDelay: '0.6s'
                      }}></div>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #a29bfe 0%, #6c5ce7 100%)',
                        boxShadow: '0 0 10px rgba(162, 155, 254, 0.6)',
                        animationDelay: '0.8s'
                      }}></div>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #fd79a8 0%, #e84393 100%)',
                        boxShadow: '0 0 10px rgba(253, 121, 168, 0.6)',
                        animationDelay: '1s'
                      }}></div>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #fdcb6e 0%, #e17055 100%)',
                        boxShadow: '0 0 10px rgba(253, 203, 110, 0.6)',
                        animationDelay: '1.2s'
                      }}></div>
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{
                        background: 'radial-gradient(circle, #00b894 0%, #00cec9 100%)',
                        boxShadow: '0 0 10px rgba(0, 184, 148, 0.6)',
                        animationDelay: '1.4s'
                      }}></div>
                    </div>
                    <svg className="absolute inset-0 w-full h-full" style={{top: '14px'}}>
                      <path d="M 0,0 Q 12.5,8 25,0 T 50,0 T 75,0 T 100,0" 
                        stroke="#636e72" 
                        strokeWidth="1.5" 
                        fill="none" 
                        vectorEffect="non-scaling-stroke"
                        style={{transform: 'scaleX(4)'}}
                      />
                    </svg>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-serif text-[#2d3436] font-bold">
                        {family.family_name}
                      </h3>
                      <span className="text-3xl">✨</span>
                    </div>

                    <div className="space-y-2 mb-4 text-gray-700">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">👨‍👩‍👧‍👦 Family Size:</span> {family.family_size}
                      </p>
                      {family.adults > 0 && (
                        <p className="text-sm">
                          <span className="font-semibold">Adults:</span> {family.adults} | 
                          <span className="font-semibold"> Children:</span> {family.children}
                          {family.children_ages && ` (ages ${family.children_ages})`}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">💰 Est. Cost:</span> ${family.estimated_cost}
                      </p>
                    </div>

                    {family.story && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 italic">"{family.story}"</p>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mb-4 border-l-4 border-[#fdcb6e]">
                      <p className="text-sm font-semibold text-gray-800 mb-1">What they need:</p>
                      <p className="text-sm text-gray-700">{family.specific_needs}</p>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold" style={{color: getStatusColor(family)}}>
                          ${family.amount_committed} raised
                        </span>
                        <span className="text-gray-600">
                          {remaining > 0 ? `$${remaining} needed` : 'Fully funded! ✨'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${percentFunded}%`,
                            background: `linear-gradient(90deg, ${getStatusColor(family)}, ${percentFunded >= 100 ? '#00b894' : '#667eea'})`
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      Through: {family.charities.name}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedFamily(family);
                        setDonationAmount(remaining > 0 ? remaining.toString() : '');
                      }}
                      className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 shadow-lg"
                      style={{
                        background: remaining > 0 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          : 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
                      }}
                    >
                      {remaining > 0 ? '💝 Help This Family' : '✓ Fully Sponsored'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {selectedFamily && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white text-3xl">
                ✨
              </div>
              <h2 className="text-2xl font-serif text-[#2d3436] mb-2">
                Sponsor {selectedFamily.family_name}
              </h2>
            </div>
            
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-[#667eea]">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Family Size:</strong> {selectedFamily.family_size} people
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Estimated Cost:</strong> ${selectedFamily.estimated_cost}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Already Committed:</strong> ${selectedFamily.amount_committed}
              </p>
              <p className="text-sm font-semibold text-[#667eea]">
                <strong>Still Needed:</strong> ${Math.max(0, selectedFamily.estimated_cost - selectedFamily.amount_committed)}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Your Sponsorship Option
                </label>
                
                <div className="space-y-3 mb-4">
                  
                  <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-purple-500 transition-colors">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="partial"
                        name="sponsorshipType"
                        checked={sponsorshipType === 'partial'}
                        onChange={() => setSponsorshipType('partial')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="partial" className="font-semibold text-gray-800 cursor-pointer">
                          Option 1: Sponsor a Portion
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Contribute any amount. The family stays available for other donors to add to.
                        </p>
                      </div>
                    </div>
                    
                    {sponsorshipType === 'partial' && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Contribution Amount ($) *
                        </label>
                        <input
                          type="number"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="50"
                          min="1"
                          max={Math.max(0, selectedFamily.estimated_cost - selectedFamily.amount_committed)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Any amount helps! Remaining needed: ${Math.max(0, selectedFamily.estimated_cost - selectedFamily.amount_committed)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-purple-500 transition-colors">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="split"
                        name="sponsorshipType"
                        checked={sponsorshipType === 'split'}
                        onChange={() => setSponsorshipType('split')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="split" className="font-semibold text-gray-800 cursor-pointer">
                          Option 2: Split with Friends/Family
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Invite specific people to co-sponsor. The family card stays active until fully funded by your group.
                        </p>
                      </div>
                    </div>
                    
                    {sponsorshipType === 'split' && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Contribution Amount ($) *
                          </label>
                          <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="100"
                            min="1"
                            max={Math.max(0, selectedFamily.estimated_cost - selectedFamily.amount_committed)}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invite Friends/Family (Email Addresses)
                          </label>
                          {friendEmails.map((email, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                  const updated = [...friendEmails];
                                  updated[index] = e.target.value;
                                  setFriendEmails(updated);
                                }}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="friend@example.com"
                              />
                              {friendEmails.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFriendEmails(friendEmails.filter((_, i) => i !== index));
                                  }}
                                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setFriendEmails([...friendEmails, ''])}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                          >
                            + Add Another Person
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Personal Message (Optional)
                          </label>
                          <textarea
                            value={splitMessage}
                            onChange={(e) => setSplitMessage(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={2}
                            placeholder="Hey! I'm sponsoring this family and thought you might want to join me..."
                            maxLength={200}
                          />
                          <p className="text-xs text-gray-500 mt-1">{splitMessage.length}/200 characters</p>
                        </div>

                        <div className="bg-blue-50 p-3 rounded text-xs text-gray-700">
                          <strong>How it works:</strong> You'll commit your amount now. Your friends will receive an email with a link to sponsor this same family. The family remains active until fully funded.
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-xs text-gray-600">
                <strong>Note:</strong> Multiple donors can contribute to the same family. The charity will coordinate with all donors for gift delivery.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedFamily(null);
                  setDonorEmail('');
                  setDonorName('');
                  setDonationAmount('');
                  setSponsorshipType('partial');
                  setFriendEmails(['']);
                  setSplitMessage('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdoptFamily}
                disabled={!donorEmail || !donorName || !donationAmount || isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold"
                style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
              >
                {isSubmitting ? 'Processing...' : '✨ Commit to Help'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}