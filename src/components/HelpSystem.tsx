
import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useLocation } from 'react-router-dom';

interface HelpItem {
  question: string;
  answer: string;
}

interface HelpContent {
  [key: string]: {
    title: string;
    description: string;
    items: HelpItem[];
  }
}

const helpContentByPath: HelpContent = {
  '/dashboard': {
    title: 'Ajuda do Dashboard',
    description: 'Aqui você encontra informações sobre como usar o Dashboard.',
    items: [
      {
        question: 'Como navegar pelo sistema?',
        answer: 'Use o menu lateral para acessar as diferentes funcionalidades. Os cartões na página principal mostram um resumo das informações mais importantes.'
      },
      {
        question: 'Como ver mais detalhes?',
        answer: 'Clique nos cartões ou use os botões "Ver mais" para acessar informações detalhadas sobre cada seção.'
      },
      {
        question: 'Como personalizar o dashboard?',
        answer: 'Suas preferências são salvas automaticamente. Você pode reorganizar os cartões arrastando-os para a posição desejada.'
      }
    ]
  },
  '/reports': {
    title: 'Ajuda de Relatórios',
    description: 'Saiba como gerar e personalizar relatórios.',
    items: [
      {
        question: 'Como gerar um relatório?',
        answer: 'Selecione o tipo de relatório desejado e clique em "Gerar Relatório". Você será redirecionado para uma página onde poderá configurar filtros específicos.'
      },
      {
        question: 'Como exportar relatórios?',
        answer: 'Após gerar um relatório, use os botões "Exportar PDF" ou "Exportar Excel" para baixar o relatório no formato desejado.'
      },
      {
        question: 'Os relatórios são atualizados automaticamente?',
        answer: 'Sim, todos os relatórios mostram os dados mais recentes disponíveis no sistema no momento em que são gerados.'
      }
    ]
  },
  '/reports/student-bulletin': {
    title: 'Ajuda do Boletim Individual',
    description: 'Aprenda a usar o boletim individual de alunos.',
    items: [
      {
        question: 'Como selecionar um aluno diferente?',
        answer: 'Use o seletor "Aluno" no topo da página para escolher outro aluno.'
      },
      {
        question: 'Como mudar o período avaliado?',
        answer: 'Use o seletor "Período" para escolher o semestre desejado.'
      },
      {
        question: 'O que significam os gráficos?',
        answer: 'Os gráficos mostram o desempenho do aluno por disciplina e a frequência em cada mês do período selecionado.'
      }
    ]
  },
  '/communication/messages': {
    title: 'Ajuda de Mensagens',
    description: 'Saiba como usar o sistema de mensagens internas.',
    items: [
      {
        question: 'Como enviar uma nova mensagem?',
        answer: 'Clique no botão "Nova Mensagem" e preencha os campos de destinatário, assunto e mensagem.'
      },
      {
        question: 'Como responder a uma mensagem?',
        answer: 'Abra a mensagem e clique no botão "Responder" abaixo do conteúdo da mensagem.'
      },
      {
        question: 'Como arquivar mensagens?',
        answer: 'Selecione as mensagens desejadas e clique no botão "Arquivar" na barra de ferramentas.'
      }
    ]
  },
  'default': {
    title: 'Ajuda do Sistema',
    description: 'Bem-vindo ao sistema de ajuda do Pelotão Mirim do CBMEPI.',
    items: [
      {
        question: 'Como navegar pelo sistema?',
        answer: 'Use o menu lateral para acessar as diferentes funcionalidades do sistema. Cada seção tem suas próprias ferramentas e opções.'
      },
      {
        question: 'Preciso de ajuda específica',
        answer: 'Cada página tem sua própria seção de ajuda contextual. Acesse a ajuda enquanto estiver na página desejada para ver informações específicas.'
      },
      {
        question: 'Como contatar suporte técnico?',
        answer: 'Para problemas técnicos, envie uma mensagem para o administrador do sistema através do sistema de mensagens internas.'
      }
    ]
  }
};

const HelpSystem: React.FC = () => {
  const location = useLocation();
  const [firstTimeUser, setFirstTimeUser] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('default');
  
  // Update current path when location changes
  useEffect(() => {
    const path = Object.keys(helpContentByPath).find(p => 
      location.pathname.startsWith(p) && p !== 'default'
    ) || 'default';
    
    setCurrentPath(path);
    
    // Check if user has visited this page before
    const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
    if (!visitedPages.includes(location.pathname)) {
      visitedPages.push(location.pathname);
      localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
      setFirstTimeUser(visitedPages.length <= 3); // Show welcome prompt for new users
    } else {
      setFirstTimeUser(false);
    }
  }, [location.pathname]);

  const currentHelp = helpContentByPath[currentPath];

  return (
    <>
      {/* First-time user welcome tooltip */}
      {firstTimeUser && (
        <div className="fixed bottom-16 right-16 bg-white p-4 rounded-lg shadow-lg border border-cbmepi-orange z-50 max-w-xs animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-cbmepi-black">Bem-vindo!</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={() => setFirstTimeUser(false)}>
              <X size={16} />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Parece que você é novo por aqui! Clique no botão de ajuda se precisar de orientações.
          </p>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setFirstTimeUser(false)}>
              Entendi
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Help button and sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-md bg-cbmepi-orange hover:bg-cbmepi-orange text-white">
            <HelpCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{currentHelp.title}</SheetTitle>
            <SheetDescription>{currentHelp.description}</SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              {currentHelp.items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-medium mb-2">Precisa de mais ajuda?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Entre em contato com a administração do Pelotão Mirim para suporte adicional.
            </p>
            <SheetClose asChild>
              <Button className="w-full">Fechar ajuda</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HelpSystem;
