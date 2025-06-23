
import React from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  type: 'user' | 'course' | 'class' | 'document' | 'message' | 'report';
}
