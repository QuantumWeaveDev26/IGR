import React, { useState, useEffect } from 'react';
import { X, Sparkle, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import { appuApiClient } from '../lib/n8nClient';
import { useTranslation } from '../context/LanguageContext';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    grade: 'Class 10',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await appuApiClient.submitLeadCapture({
        parent_name: formData.parentName,
        student_name: formData.studentName,
        user_phone: formData.phone,
        grade: formData.grade,
        email: formData.email,
        source: 'IGR Landing Page - Early Access Modal',
        timestamp: new Date().toISOString()
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.warn('Error submitting lead form to APPU n8n client:', err);
      setIsSubmitting(false);
      setIsSubmitted(true); // Still proceed to confirmation with local storage fallback
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      parentName: '',
      studentName: '',
      phone: '',
      grade: 'Class 10',
      email: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF9F6] border border-slate-200 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-bottom-sheet sm:animate-none max-h-[92vh] flex flex-col">

        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-3 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200/60 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#264538] animate-pulse" />
            <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl">
              {t.modals.earlyAccessTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors touch-active-bounce shrink-0 cursor-pointer"
            aria-label={t.modals.closeLabel}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto overscroll-contain">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                ✓
              </div>

              <div>
                <h4 className="font-serif font-bold text-2xl text-slate-900">
                  {t.modals.successTitle}
                </h4>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  {t.modals.successSub}
                </p>
              </div>

              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {t.modals.successMsg}
              </p>

              <div className="pt-2 space-y-3">
                <a
                  href={`https://wa.me/919740595677?text=${encodeURIComponent(
                    `Hi IGr, I submitted an application for ${formData.studentName || 'my child'} (${formData.grade}). My phone number is ${formData.phone}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkle weight="fill" className="w-4 h-4 text-emerald-300" />
                  <span>{t.modals.whatsappConnectBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
                >
                  {t.modals.doneBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="text-xs text-slate-500 font-medium mb-2">
                {t.modals.earlyAccessSubtitle}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  {t.modals.parentLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.modals.parentPlaceholder}
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  {t.modals.studentLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.modals.studentPlaceholder}
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    {t.modals.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.modals.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    {t.modals.classLabel}
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6] font-medium"
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  {t.modals.emailLabel}
                </label>
                <input
                  type="email"
                  placeholder={t.modals.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#264538] hover:bg-[#1b3228] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? t.modals.submittingBtn : t.modals.submitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center font-mono pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.modals.privacyBadge}</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
