
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Section {
  id: number;
  section_name: string;
  title: string;
  description: string | null;
  cta_text: string | null;
  cta_section: string | null;
  video_url: string | null;
}

const Admin = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sections
  const { data: sections, isLoading } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data as Section[];
    }
  });

  // Update section mutation
  const updateSection = useMutation({
    mutationFn: async (section: Section) => {
      const { error } = await supabase
        .from('sections')
        .update({
          title: section.title,
          description: section.description,
          cta_text: section.cta_text,
          cta_section: section.cta_section,
          video_url: section.video_url,
        })
        .eq('id', section.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      toast({
        title: "Success",
        description: "Section updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update section",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 p-8">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Sections</h1>
          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="space-y-8">
          {sections?.map((section) => (
            <form
              key={section.id}
              className="glass-card p-6 rounded-lg space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                updateSection.mutate(section);
              }}
            >
              <div className="text-lg font-semibold text-white mb-4">
                {section.section_name.toUpperCase()}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-300">Title</label>
                  <Input
                    value={section.title}
                    onChange={(e) => {
                      const newSections = sections.map(s =>
                        s.id === section.id ? { ...s, title: e.target.value } : s
                      );
                      queryClient.setQueryData(['sections'], newSections);
                    }}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-300">Description</label>
                  <Textarea
                    value={section.description || ''}
                    onChange={(e) => {
                      const newSections = sections.map(s =>
                        s.id === section.id ? { ...s, description: e.target.value } : s
                      );
                      queryClient.setQueryData(['sections'], newSections);
                    }}
                    className="mt-1"
                  />
                </div>

                {(section.cta_text !== null || section.cta_section !== null) && (
                  <>
                    <div>
                      <label className="text-sm text-neutral-300">CTA Text</label>
                      <Input
                        value={section.cta_text || ''}
                        onChange={(e) => {
                          const newSections = sections.map(s =>
                            s.id === section.id ? { ...s, cta_text: e.target.value } : s
                          );
                          queryClient.setQueryData(['sections'], newSections);
                        }}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-neutral-300">CTA Section</label>
                      <Input
                        value={section.cta_section || ''}
                        onChange={(e) => {
                          const newSections = sections.map(s =>
                            s.id === section.id ? { ...s, cta_section: e.target.value } : s
                          );
                          queryClient.setQueryData(['sections'], newSections);
                        }}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {section.video_url !== null && (
                  <div>
                    <label className="text-sm text-neutral-300">Video URL</label>
                    <Input
                      value={section.video_url || ''}
                      onChange={(e) => {
                        const newSections = sections.map(s =>
                          s.id === section.id ? { ...s, video_url: e.target.value } : s
                        );
                        queryClient.setQueryData(['sections'], newSections);
                      }}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
