from database.db import conectar, obter_generos_preferidos

class RecomendacaoService:
    """
    Serviço de recomendações de livros baseado em:
    1. Gêneros preferidos selecionados pelo usuário
    2. Gêneros dos livros que o usuário marcou como lidos
    3. Livros que ainda não estão na biblioteca do usuário
    """
    
    @staticmethod
    def obter_recomendacoes(usuario_id, limite=10):
        """
        Obtém recomendações de livros para o usuário.
        
        Args:
            usuario_id: ID do usuário
            limite: Número máximo de recomendações
        
        Returns:
            Lista de tuplas (id, titulo, autor, genero, isbn)
        """
        conn = conectar()
        cur = conn.cursor()
        
        # 1. Buscar gêneros dos livros que o usuário já leu
        cur.execute("""
            SELECT DISTINCT l.genero
            FROM biblioteca b
            JOIN livros l ON b.livro_id = l.id
            WHERE b.usuario_id = ? AND b.lido = 1
        """, (usuario_id,))
        
        generos_lidos = [row[0] for row in cur.fetchall()]
        
        if not generos_lidos:
            # Se o usuário não leu nada, retorna livros populares
            cur.execute("""
                SELECT id, titulo, autor, genero, isbn
                FROM livros
                WHERE id NOT IN (
                    SELECT livro_id FROM biblioteca WHERE usuario_id = ?
                )
                ORDER BY titulo ASC
                LIMIT ?
            """, (usuario_id, limite))
            resultados = cur.fetchall()
            conn.close()
            return resultados
        
        # 2. Buscar livros desses gêneros que o usuário ainda não adicionou à biblioteca
        placeholders = ','.join(['?' for _ in generos_lidos])
        query = f"""
            SELECT id, titulo, autor, genero, isbn
            FROM livros
            WHERE genero IN ({placeholders})
            AND id NOT IN (
                SELECT livro_id FROM biblioteca WHERE usuario_id = ?
            )
            ORDER BY genero ASC, titulo ASC
            LIMIT ?
        """
        params = generos_lidos + [usuario_id, limite]
        cur.execute(query, params)
        resultados = cur.fetchall()
        
        conn.close()
        return resultados
    
    @staticmethod
    def obter_recomendacoes_personalizadas(usuario_id, limite=10):
        """
        Obtém recomendações personalizadas considerando múltiplos fatores:
        1. Gêneros preferidos selecionados pelo usuário (PRIORIDADE)
        2. Gêneros mais frequentes nos livros lidos
        3. Autores dos livros lidos
        4. Livros populares não lidos
        """
        conn = conectar()
        cur = conn.cursor()
        
        # 1. Buscar gêneros preferidos do usuário (selecionados no perfil)
        generos_preferidos = obter_generos_preferidos(usuario_id)
        
        # 2. Se há gêneros preferidos, priorizar eles
        if generos_preferidos:
            placeholders = ','.join(['?' for _ in generos_preferidos])
            query = f"""
                SELECT id, titulo, autor, genero, isbn
                FROM livros
                WHERE genero IN ({placeholders})
                AND id NOT IN (
                    SELECT livro_id FROM biblioteca WHERE usuario_id = ?
                )
                AND id NOT IN (
                    SELECT livro_id FROM lista_desejos WHERE usuario_id = ?
                )
                ORDER BY genero ASC, titulo ASC
                LIMIT ?
            """
            params = generos_preferidos + [usuario_id, usuario_id, limite]
            cur.execute(query, params)
            resultados = cur.fetchall()
        else:
            # 3. Se sem preferências, buscar gêneros mais frequentes nos livros lidos
            cur.execute("""
                SELECT genero, COUNT(*) as freq
                FROM biblioteca b
                JOIN livros l ON b.livro_id = l.id
                WHERE b.usuario_id = ? AND b.lido = 1
                GROUP BY genero
                ORDER BY freq DESC
                LIMIT 3
            """, (usuario_id,))
            
            generos_favoritos = [row[0] for row in cur.fetchall()]
            
            if generos_favoritos:
                placeholders = ','.join(['?' for _ in generos_favoritos])
                query = f"""
                    SELECT id, titulo, autor, genero, isbn
                    FROM livros
                    WHERE genero IN ({placeholders})
                    AND id NOT IN (
                        SELECT livro_id FROM biblioteca WHERE usuario_id = ?
                    )
                    AND id NOT IN (
                        SELECT livro_id FROM lista_desejos WHERE usuario_id = ?
                    )
                    ORDER BY genero ASC, titulo ASC
                    LIMIT ?
                """
                params = generos_favoritos + [usuario_id, usuario_id, limite]
                cur.execute(query, params)
                resultados = cur.fetchall()
            else:
                # 4. Sem nenhuma preferência, retorna livros não adicionados
                cur.execute("""
                    SELECT id, titulo, autor, genero, isbn
                    FROM livros
                    WHERE id NOT IN (
                        SELECT livro_id FROM biblioteca WHERE usuario_id = ?
                    )
                    ORDER BY titulo ASC
                    LIMIT ?
                """, (usuario_id, limite))
                resultados = cur.fetchall()
        
        conn.close()
        return resultados
    
    @staticmethod
    def obter_generos_favoritos(usuario_id):
        """
        Retorna os gêneros favoritos do usuário baseado no histórico de leitura.
        """
        conn = conectar()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT genero, COUNT(*) as quantidade
            FROM biblioteca b
            JOIN livros l ON b.livro_id = l.id
            WHERE b.usuario_id = ? AND b.lido = 1
            GROUP BY genero
            ORDER BY quantidade DESC
        """, (usuario_id,))
        
        generos = cur.fetchall()
        conn.close()
        return generos
