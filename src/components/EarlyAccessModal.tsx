import React, { useState, useEffect } from 'react';
import { X, Sparkle, CheckCircle, ArrowRight, ShieldCheck, WarningCircle } from '@phosphor-icons/react';
import { n8nClient } from '../lib/n8nClient';
import { useLanguage } from '../context/LanguageContext';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    grade: 'Class 10'
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    
    // Submit Lead to secure APPU backend pipeline
    const leadPayload = {
      user_name: formData.parentName || formData.studentName || 'Parent',
      user_phone: formData.phone,
      student_name: formData.studentName,
      email: formData.email,
      grade: formData.grade,
      event_type: 'DISCOVERY_CALL_BOOKING',
      timestamp: new Date().toISOString()
    };

    const res = await n8nClient.submitLeadCapture(leadPayload);
    setIsSubmitting(false);

    if (res && res.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(t('modal.ea.error'));
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMessage(null);
    setFormData({ parentName: '', studentName: '', email: '', phone: '', grade: 'Class 10' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-bottom-sheet sm:animate-none max-h-[90vh] flex flex-col">

        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-[#FAF9F6] shrink-0">
          <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-[#134340] text-white flex items-center justify-center text-sm">
              <Sparkle weight="fill" className="w-4 h-4 text-[#E2E0C8]" />
            </div>
            <span>{t('modal.ea.title')}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors touch-active-bounce"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle weight="fill" className="w-10 h-10 text-emerald-500" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-serif">
                  {t('modal.ea.successTitle')}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  {t('modal.ea.successSaved')}
                </p>
              </div>

              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {t('modal.ea.successThank')} <strong className="text-slate-900">{formData.parentName || 'Parent'}</strong>. {t('modal.ea.successMsg')}
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
                  <span>{t('modal.ea.connectWa')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
                >
                  {t('modal.ea.done')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="text-xs text-slate-500 font-medium mb-2">
                {t('modal.ea.desc')}
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <WarningCircle weight="fill" className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{errorMessage}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  {t('modal.ea.parentName')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('modal.ea.parentPlaceholder')}
                  value={formData.parentName}
                  onChange={(e) => {
                    setErrorMessage(null);
                    setFormData({ ...formData, parentName: e.target.value });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  {t('modal.ea.studentName')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('modal.ea.studentPlaceholder')}
                  value={formData.studentName}
                  onChange={(e) => {
                    setErrorMessage(null);
                    setFormData({ ...formData, studentName: e.target.value });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    {t('modal.ea.phone')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t('modal.ea.phonePlaceholder')}
                    value={formData.phone}
                    onChange={(e) => {
                      setErrorMessage(null);
                      setFormData({ ...formData, phone: e.target.value });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    {t('modal.ea.grade')}
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
                  {t('modal.ea.email')}
                </label>
                <input
                  type="email"
                  placeholder={t('modal.ea.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => {
                    setErrorMessage(null);
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-slate-800 focus:outline-none bg-[#FAF9F6]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#264538] hover:bg-[#1b3228] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? t('modal.ea.submitting') : t('modal.ea.submit')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center font-mono pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('modal.ea.privacy')}</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
