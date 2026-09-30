'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2, FileText, Calendar, Users, Image as ImageIcon, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.length > 2) {
        setIsSearching(true);
        
        try {
          const supabase = createClient();
          const searchTerm = `%${debouncedQuery}%`;
          
          const [
            { data: members },
            { data: programs },
            { data: events },
            { data: gallery },
            { data: ekskul }
          ] = await Promise.all([
            supabase.from('members').select('id, name, description').ilike('name', searchTerm).eq('active', true).limit(5),
            supabase.from('programs').select('id, title, category').ilike('title', searchTerm).eq('published', true).limit(5),
            supabase.from('events').select('id, title, date').ilike('title', searchTerm).eq('published', true).limit(5),
            supabase.from('gallery').select('id, title, category').ilike('title', searchTerm).eq('published', true).limit(5),
            supabase.from('extracurriculars').select('id, name, description').ilike('name', searchTerm).eq('active', true).limit(5)
          ]);

          const combinedResults: any[] = [];
          
          if (programs) {
            combinedResults.push(...programs.map(p => ({ ...p, type: 'program', icon: FileText, color: 'text-blue-500', href: `/program-kerja/${p.id}` })));
          }
          if (events) {
            combinedResults.push(...events.map(e => ({ ...e, type: 'event', icon: Calendar, color: 'text-green-500', href: `/kalender` })));
          }
          if (members) {
            combinedResults.push(...members.map(m => ({ ...m, title: m.name, category: 'Pengurus', type: 'member', icon: Users, color: 'text-orange-500', href: `/kepengurusan` })));
          }
          if (gallery) {
            combinedResults.push(...gallery.map(g => ({ ...g, type: 'gallery', icon: ImageIcon, color: 'text-purple-500', href: `/dokumentasi` })));
          }
          if (ekskul) {
            combinedResults.push(...ekskul.map(e => ({ ...e, title: e.name, category: 'Ekstrakurikuler', type: 'ekskul', icon: Activity, color: 'text-red-500', href: `/ekstrakurikuler/${e.id}` })));
          }

          setResults(combinedResults);
          setHasSearched(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setHasSearched(false);
        setResults([]);
      }
    }
    performSearch();
  }, [debouncedQuery]);

  return (
    <div className="flex flex-col w-full min-h-screen pb-20">
      <section className="pt-32 pb-12 bg-secondary/20">
        <div className="container-editorial max-w-3xl">
          <ScrollReveal>
            <h1 className="text-3xl font-bold text-primary mb-6 text-center">Cari Informasi</h1>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-primary/40 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Cari program kerja, agenda, ekskul, pengurus..."
                className="pl-12 py-6 text-lg rounded-2xl bg-white border-2 border-secondary/50 focus-visible:ring-0 focus-visible:border-primary shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              )}
            </div>
            <p className="text-center text-sm text-primary/60 mt-4">
              Ketik minimal 3 karakter untuk mulai mencari
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="flex-1 section-padding">
        <div className="container-editorial max-w-3xl">
          {!hasSearched && query.length <= 2 ? (
            <div className="text-center py-20 text-primary/40">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Mulai mengetik untuk mencari data di website OSIS.</p>
            </div>
          ) : isSearching ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full h-24 bg-secondary/30 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-sm font-medium text-primary/60 mb-6">
                Menampilkan hasil pencarian untuk "<span className="text-primary">{debouncedQuery}</span>"
              </p>

              {results.length === 0 ? (
                <div className="text-center py-10 bg-secondary/10 rounded-2xl border border-secondary/30">
                  <p className="text-primary/60">Tidak ditemukan hasil untuk pencarian tersebut.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <Link key={`${item.type}-${item.id}-${idx}`} href={item.href} className="block p-4 rounded-xl border border-secondary/50 hover:bg-secondary/10 transition-colors">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-1 ${item.color}`} />
                          <div>
                            <h4 className="font-bold text-primary text-lg">{item.title}</h4>
                            <p className="text-sm text-primary/70 uppercase text-xs font-semibold tracking-wider">{item.type} &bull; {item.category || item.date || item.description?.substring(0, 50)}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
