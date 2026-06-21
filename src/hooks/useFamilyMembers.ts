import { useState, useEffect } from 'react';

export type FamilyMember = {
  id: number;
  name: string;
  phone: string;
  relation: string;
  isEmergency: boolean;
  avatar?: string;
};

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: 1, name: '家庭成员 A', phone: '', relation: '主照护人/女儿', isEmergency: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
  { id: 2, name: '家庭成员 B', phone: '', relation: '家人/儿子', isEmergency: false, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' }
];

type MembersUpdater = FamilyMember[] | ((prev: FamilyMember[]) => FamilyMember[]);

function readCachedMembers() {
  const saved = localStorage.getItem('familyMembers');

  if (saved) {
    try {
      return JSON.parse(saved) as FamilyMember[];
    } catch {
      localStorage.removeItem('familyMembers');
    }
  }

  return DEFAULT_MEMBERS;
}

function cacheAndBroadcast(members: FamilyMember[]) {
  localStorage.setItem('familyMembers', JSON.stringify(members));
  window.dispatchEvent(new Event('familyMembersUpdated'));
}

async function syncMembersToServer(members: FamilyMember[]) {
  const response = await fetch('/api/family-members', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ members }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || '联系人保存失败');
  }

  return response.json() as Promise<{ members: FamilyMember[] }>;
}

export function useFamilyMembers(): [FamilyMember[], (newMembers: MembersUpdater) => void] {
  const [members, setMembersState] = useState<FamilyMember[]>(readCachedMembers);

  const setMembers = (newMembers: MembersUpdater) => {
    setMembersState((prev) => {
      const next = typeof newMembers === 'function' ? newMembers(prev) : newMembers;
      cacheAndBroadcast(next);

      syncMembersToServer(next)
        .then((data) => {
          if (Array.isArray(data.members)) {
            cacheAndBroadcast(data.members);
            setMembersState(data.members);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      return next;
    });
  };

  useEffect(() => {
    let isMounted = true;

    fetch('/api/family-members')
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (isMounted && Array.isArray(data?.members)) {
          setMembersState(data.members);
          cacheAndBroadcast(data.members);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMembersState(readCachedMembers());
        }
      });

    const handleUpdate = () => {
      setMembersState(readCachedMembers());
    };

    window.addEventListener('familyMembersUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('familyMembersUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return [members, setMembers];
}
