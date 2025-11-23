export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      biblioteca: {
        Row: {
          data_adicao: string
          id: string
          livro_id: string
          status: string | null
          usuario_id: string
        }
        Insert: {
          data_adicao?: string
          id?: string
          livro_id: string
          status?: string | null
          usuario_id: string
        }
        Update: {
          data_adicao?: string
          id?: string
          livro_id?: string
          status?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "biblioteca_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
        ]
      }
      editoras: {
        Row: {
          created_at: string
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          created_at?: string
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          created_at?: string
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      generos: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      lista_desejos: {
        Row: {
          data_adicao: string
          id: string
          livro_id: string
          prioridade: number | null
          usuario_id: string
        }
        Insert: {
          data_adicao?: string
          id?: string
          livro_id: string
          prioridade?: number | null
          usuario_id: string
        }
        Update: {
          data_adicao?: string
          id?: string
          livro_id?: string
          prioridade?: number | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lista_desejos_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
        ]
      }
      livros: {
        Row: {
          ano_publicacao: number | null
          autor: string
          capa_url: string | null
          created_at: string
          editora_id: string | null
          id: string
          isbn: string | null
          num_paginas: number | null
          sinopse: string | null
          titulo: string
        }
        Insert: {
          ano_publicacao?: number | null
          autor: string
          capa_url?: string | null
          created_at?: string
          editora_id?: string | null
          id?: string
          isbn?: string | null
          num_paginas?: number | null
          sinopse?: string | null
          titulo: string
        }
        Update: {
          ano_publicacao?: number | null
          autor?: string
          capa_url?: string | null
          created_at?: string
          editora_id?: string | null
          id?: string
          isbn?: string | null
          num_paginas?: number | null
          sinopse?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "livros_editora_id_fkey"
            columns: ["editora_id"]
            isOneToOne: false
            referencedRelation: "editoras"
            referencedColumns: ["id"]
          },
        ]
      }
      livros_generos: {
        Row: {
          genero_id: string
          livro_id: string
        }
        Insert: {
          genero_id: string
          livro_id: string
        }
        Update: {
          genero_id?: string
          livro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "livros_generos_genero_id_fkey"
            columns: ["genero_id"]
            isOneToOne: false
            referencedRelation: "generos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livros_generos_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
        ]
      }
      preferencias_leitura: {
        Row: {
          autores_favoritos: string[] | null
          created_at: string
          generos_favoritos: string[] | null
          id: string
          temas_interesse: string[] | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          autores_favoritos?: string[] | null
          created_at?: string
          generos_favoritos?: string[] | null
          id?: string
          temas_interesse?: string[] | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          autores_favoritos?: string[] | null
          created_at?: string
          generos_favoritos?: string[] | null
          id?: string
          temas_interesse?: string[] | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          nome: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      progresso_leitura: {
        Row: {
          data_conclusao: string | null
          data_inicio: string | null
          id: string
          livro_id: string
          pagina_atual: number | null
          porcentagem: number | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          data_conclusao?: string | null
          data_inicio?: string | null
          id?: string
          livro_id: string
          pagina_atual?: number | null
          porcentagem?: number | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          data_conclusao?: string | null
          data_inicio?: string | null
          id?: string
          livro_id?: string
          pagina_atual?: number | null
          porcentagem?: number | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progresso_leitura_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
        ]
      }
      resenhas: {
        Row: {
          avaliacao: number | null
          conteudo: string
          created_at: string
          id: string
          livro_id: string
          titulo: string | null
          updated_at: string
          usuario_id: string
          visibilidade: string | null
        }
        Insert: {
          avaliacao?: number | null
          conteudo: string
          created_at?: string
          id?: string
          livro_id: string
          titulo?: string | null
          updated_at?: string
          usuario_id: string
          visibilidade?: string | null
        }
        Update: {
          avaliacao?: number | null
          conteudo?: string
          created_at?: string
          id?: string
          livro_id?: string
          titulo?: string | null
          updated_at?: string
          usuario_id?: string
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resenhas_livro_id_fkey"
            columns: ["livro_id"]
            isOneToOne: false
            referencedRelation: "livros"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
