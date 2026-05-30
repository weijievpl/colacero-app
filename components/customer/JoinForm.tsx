'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useQueueStore } from '@/lib/store/queueStore';
import type { TicketReason } from '@/lib/types';
import { MIN_SUBMIT_DELAY } from '@/lib/constants';

const REASONS: TicketReason[] = ['information', 'appointment', 'complaint', 'payment', 'pickup', 'other'];
const MAX_PARTY_SIZE = 10;

export function JoinForm() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const t = useTranslations('join');
  
  const joinQueue = useQueueStore((s) => s.joinQueue);
  const setUserInteracted = useQueueStore((s) => s.setUserInteracted);

  const [name, setName] = useState('');
  const [reason, setReason] = useState<TicketReason | ''>('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(1);
  const [showGroupOption, setShowGroupOption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [welcomeBack, setWelcomeBack] = useState<string | null>(null);

  // Check for returning customer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastVisit = localStorage.getItem('colacero-last-visit');
      if (lastVisit) {
        try {
          const data = JSON.parse(lastVisit);
          if (data.name && Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
            setWelcomeBack(data.name);
            if (data.reason) setReason(data.reason);
          }
        } catch {}
      }
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};
    
    if (name && name.trim().length < 2) {
      newErrors.name = locale === 'zh' ? '姓名至少2个字符' : locale === 'es' ? 'El nombre debe tener al menos 2 caracteres' : 'Name must be at least 2 characters';
    }
    
    if (phone && !/^\+?[\d\s-]{7,}$/.test(phone)) {
      newErrors.phone = locale === 'zh' ? '请输入有效的电话号码' : locale === 'es' ? 'Por favor, introduce un teléfono válido' : 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserInteracted();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, MIN_SUBMIT_DELAY));
    
    const ticket = joinQueue({
      name: name.trim() || undefined,
      reason: reason || undefined,
      phone: phone.trim() || undefined,
      partySize: partySize > 1 ? partySize : undefined,
    });
    
    // Save for returning customer detection
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`colacero-ticket-${ticket.id}`, JSON.stringify(ticket));
      if (name.trim()) {
        localStorage.setItem('colacero-last-visit', JSON.stringify({
          name: name.trim(),
          reason: reason || undefined,
          timestamp: Date.now(),
        }));
      }
    }
    
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    router.push(`/${locale}/wait/${ticket.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Welcome back banner */}
      <AnimatePresence>
        {welcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl bg-primary/10 p-3 text-center text-sm font-medium text-primary"
          >
            👋 {locale === 'zh' ? `欢迎回来，${welcomeBack}！` : locale === 'es' ? `¡Bienvenido de nuevo, ${welcomeBack}!` : `Welcome back, ${welcomeBack}!`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('namePlaceholder')}
          maxLength={60}
          autoComplete="name"
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p id="name-error" className="text-sm text-destructive" role="alert">{errors.name}</p>}
      </div>

      {/* Reason field */}
      <div className="space-y-2">
        <Label htmlFor="reason">{t('reason')}</Label>
        <Select value={reason} onValueChange={(v) => setReason(v as TicketReason)}>
          <SelectTrigger id="reason"><SelectValue placeholder={t('reason')} /></SelectTrigger>
          <SelectContent>
            {REASONS.map((r) => (
              <SelectItem key={r} value={r}>{t(`reasons.${r}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Group/Party size toggle */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowGroupOption(!showGroupOption)}
          className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm font-medium active:bg-muted/50"
        >
          <span className="flex items-center gap-2">
            {partySize > 1 ? <Users className="h-4 w-4 text-primary" /> : <User className="h-4 w-4" />}
            {partySize > 1
              ? (locale === 'zh' ? `${partySize}人团体` : locale === 'es' ? `Grupo de ${partySize}` : `Party of ${partySize}`)
              : (locale === 'zh' ? '添加团体人数' : locale === 'es' ? '¿Vienes en grupo?' : 'Coming in a group?')}
          </span>
          {showGroupOption ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        <AnimatePresence>
          {showGroupOption && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  disabled={partySize <= 1}
                >-</Button>
                <span className="flex-1 text-center text-lg font-bold">{partySize}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPartySize(Math.min(MAX_PARTY_SIZE, partySize + 1))}
                  disabled={partySize >= MAX_PARTY_SIZE}
                >+</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phone field */}
      <div className="space-y-2">
        <Label htmlFor="phone">{t('phone')}</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('phonePlaceholder')}
          autoComplete="tel"
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          className={errors.phone ? 'border-destructive' : ''}
        />
        {errors.phone && <p id="phone-error" className="text-sm text-destructive" role="alert">{errors.phone}</p>}
      </div>

      {/* Privacy note */}
      <p className="text-xs text-muted-foreground">{t('privacyNote')}</p>

      {/* Submit button */}
      <Button 
        type="submit" 
        className="min-h-[52px] w-full text-lg rounded-xl shadow-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <><Spinner className="mr-2 h-4 w-4" />{t('submitting')}</>
        ) : (
          t('submit')
        )}
      </Button>
    </form>
  );
}
