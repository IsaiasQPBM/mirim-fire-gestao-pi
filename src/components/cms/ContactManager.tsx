
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  emergencyPhone: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

const ContactManager: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'contato@cbmepi.gov.br',
    phone: '(86) 3216-8100',
    address: 'Av. Dom Severino, 2551 - Fátima, Teresina - PI, 64049-901',
    whatsapp: '(86) 99999-9999',
    emergencyPhone: '193',
    website: 'https://www.cbmepi.gov.br',
    socialMedia: {
      facebook: 'https://facebook.com/cbmepi',
      instagram: 'https://instagram.com/cbmepi',
      youtube: 'https://youtube.com/cbmepi'
    }
  });

  const { toast } = useToast();

  const handleSave = () => {
    // Aqui você salvaria no banco de dados via API
    console.log('Informações de contato atualizadas:', contactInfo);
    toast({
      title: "Informações atualizadas",
      description: "As informações de contato foram salvas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato Principais
          </CardTitle>
          <CardDescription>
            Configure as informações de contato principais da instituição.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Principal</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Telefone Principal</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="whatsapp"
                  value={contactInfo.whatsapp}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="emergencyPhone"
                  value={contactInfo.emergencyPhone}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço Completo</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                value={contactInfo.address}
                onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                className="pl-9"
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={contactInfo.website}
              onChange={(e) => setContactInfo(prev => ({ ...prev, website: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>
            Configure os links das redes sociais oficiais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              type="url"
              value={contactInfo.socialMedia.facebook}
              onChange={(e) => setContactInfo(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, facebook: e.target.value }
              }))}
              placeholder="https://facebook.com/cbmepi"
            />
          </div>

          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="url"
              value={contactInfo.socialMedia.instagram}
              onChange={(e) => setContactInfo(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, instagram: e.target.value }
              }))}
              placeholder="https://instagram.com/cbmepi"
            />
          </div>

          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              type="url"
              value={contactInfo.socialMedia.youtube}
              onChange={(e) => setContactInfo(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, youtube: e.target.value }
              }))}
              placeholder="https://youtube.com/cbmepi"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
          <Save className="h-4 w-4 mr-2" />
          Salvar Informações de Contato
        </Button>
      </div>
    </div>
  );
};

export default ContactManager;
