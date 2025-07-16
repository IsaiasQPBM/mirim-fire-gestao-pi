
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Type, Menu, Phone, Palette, Loader2 } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CMSContentManager from './content/CMSContentManager';
import CMSMenusManager from './content/CMSMenusManager';
import CMSContactManager from './content/CMSContactManager';
import CMSAppearanceManager from './content/CMSAppearanceManager';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type CMSContent = {
  id: string;
  key: string;
  type: 'text' | 'image' | 'document' | 'menu' | 'contact' | 'logo';
  value: string;
  label: string;
  description?: string;
  updated_at: string;
  updated_by: string;
};

const ContentManagement: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      window.location.href = '/';
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
  }, []);

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
            <span className="ml-2 text-gray-600">Carregando conteúdo...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cbmepi-orange text-white rounded hover:bg-cbmepi-orange/90"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Gerenciamento de Conteúdo</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-cbmepi-black mb-2">Sistema de Gerenciamento de Conteúdo (CMS)</h1>
              <p className="text-gray-600">
                Gerencie todo o conteúdo editável do sistema, incluindo textos, imagens, menus e configurações.
              </p>
            </div>

            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Conteúdo
                </TabsTrigger>
                <TabsTrigger value="menus" className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  Menus
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contato
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Aparência
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content">
                <CMSContentManager />
              </TabsContent>

              <TabsContent value="menus">
                <CMSMenusManager />
              </TabsContent>

              <TabsContent value="contact">
                <CMSContactManager />
              </TabsContent>

              <TabsContent value="appearance">
                <CMSAppearanceManager />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
