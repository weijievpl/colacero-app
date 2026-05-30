'use client';
// Required: Uses form state, validation, and client-side navigation

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; phone?: string } = {};
    
    if (name && name.trim().length < 2) {
      newErrors.name = locale === 'zh' 
        ? '姓名至少2个字符' 
        : locale === 'es' 
          ? 'El nombre debe tener al menos 2 caracteres' 
          : 'Name must be at least 2 characters';
    }
    
    if (phone && !/^\+?[\d\s-]{7,}$/.test(phone)) {
      newErrors.phone = locale === 'zh'
        ? '请输入有效的电话号码'
        : locale === 'es'
          ? 'Por favor, introduce un teléfono válido'
          : 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserInteracted();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Minimum delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, MIN_SUBMIT_DELAY));
    
    const ticket = joinQueue({
      name: name.trim() || undefined,
      reason: reason || undefined,
      phone: phone.trim() || undefined,
    });
    
    // Store ticket in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`colacero-ticket-${ticket.id}`, JSON.stringify(ticket));
    }
    
    router.push(`/${locale}/wait/${ticket.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Reason field */}
      <div className="space-y-2">
        <Label htmlFor="reason">{t('reason')}</Label>
        <Select value={reason} onValueChange={(v) => setReason(v as TicketReason)}>
          <SelectTrigger id="reason">
            <SelectValue placeholder={t('reason')} />
          </SelectTrigger>
          <SelectContent>
            {REASONS.map((r) => (
              <SelectItem key={r} value={r}>
                {t(`reasons.${r}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        {errors.phone && (
          <p id="phone-error" className="text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Privacy note */}
      <p className="text-sm text-muted-foreground">
        {t('privacyNote')}
      </p>

      {/* Submit button */}
      <Button 
        type="submit" 
        className="min-h-[48px] w-full text-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            {t('submitting')}
          </>
        ) : (
          t('submit')
        )}
      </Button>
    </form>
  );
}
