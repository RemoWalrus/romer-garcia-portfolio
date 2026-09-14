import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "reverb-collective-email";

/**
 * Collective gate for /reverb/downloads.
 *
 * Access is email-only: the visitor types the address they joined with and the
 * `is_collective_member` Supabase function (SECURITY DEFINER) confirms it is on
 * the list without ever exposing the subscriber table to the client.
 * The verified address is remembered in localStorage so members don't retype it.
 */
export const getCollectiveEmail = (): string | null => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setCollectiveEmail = (email: string | null) => {
  try {
    if (email) localStorage.setItem(KEY, email);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
};

export const checkCollectiveMember = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc("is_collective_member", {
    _email: email,
  });
  if (error) throw error;
  return data === true;
};

export const useCollectiveAccess = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getCollectiveEmail();
    if (!stored) {
      setReady(true);
      return;
    }

    let cancelled = false;
    // Re-confirm the stored address so a removed subscriber loses access.
    checkCollectiveMember(stored)
      .then((ok) => {
        if (cancelled) return;
        if (ok) setEmail(stored);
        else setCollectiveEmail(null);
      })
      .catch(() => {
        // Offline / transient failure: keep the remembered member signed in.
        if (!cancelled) setEmail(stored);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const grant = useCallback((value: string) => {
    setCollectiveEmail(value);
    setEmail(value);
  }, []);

  const revoke = useCallback(() => {
    setCollectiveEmail(null);
    setEmail(null);
  }, []);

  return { email, ready, grant, revoke };
};
