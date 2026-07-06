import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { createMotionPlan } from '../utils/motionConfig';

export function useGsapMotion(rootRef: RefObject<HTMLElement>, routeKey: string) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const plan = createMotionPlan(reducedMotion);
    if (!plan.enabled) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.set(plan.staggerTargets, { autoAlpha: 0, y: 28, filter: 'blur(8px)' });

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to('.hero-panel, .page-title-block', {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.72,
        })
        .to(
          '.kpi-card, .industrial-card, .recommendation-card',
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.62,
            stagger: { each: 0.055, from: 'start' },
          },
          '-=0.28',
        );

      gsap.to('.hero-metrics', {
        y: -6,
        boxShadow: '0 0 34px rgba(33, 212, 253, 0.32)',
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.process-flow-map', {
        boxShadow: '0 0 34px rgba(33, 212, 253, 0.22), inset 0 0 20px rgba(16, 185, 129, 0.08)',
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.sparkline i', {
        scaleY: 1.16,
        transformOrigin: 'bottom center',
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.08,
        ease: 'sine.inOut',
      });
    }, root);

    return () => context.revert();
  }, [rootRef, routeKey]);
}
