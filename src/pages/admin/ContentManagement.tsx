
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Type, Menu, Phone, Palette } from 'lucide-react';
import Header from '@/components/Header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CMSEditor from '@/components/cms/CMSEditor';
import MenuManager from '@/components/cms/MenuManager';
import ContactManager from '@/components/cms/ContactManager';
import AppearanceManager from '@/components/cms/AppearanceManager';
import { mockCMSContent } from '@/data/mockCMSData';
import { CMSContent } from '@/data/cmsTypes';

const ContentManagement: React.FC = () => {
  const userRole = localStorage.getItem('userRole') || '';
  const userName = localStorage.getItem('userName') || '';
  const [cmsContent, setCmsContent] = useState<CMSContent[]>(mockCMSContent);

  const handleSaveContent = (updatedContent: CMSContent[]) => {
    setCmsContent(updatedContent);
    // Aqui você salvaria no banco de dados via API
    console.log('Conteúdo CMS atualizado:', updatedContent);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Header title="Gerenciamento de Conteúdo" userRole={userRole} userName={userName} />
      
      <main className="p-4 md:p-6 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb>
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
              <CMSEditor content={cmsContent} onSave={handleSaveContent} />
            </TabsContent>

            <TabsContent value="menus">
              <MenuManager />
            </TabsContent>

            <TabsContent value="contact">
              <ContactManager />
            </TabsContent>

            <TabsContent value="appearance">
              <AppearanceManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ContentManagement;
