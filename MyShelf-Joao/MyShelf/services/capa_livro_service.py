import requests
import logging

logger = logging.getLogger(__name__)

class BookCoverService:
    """
    Serviço para buscar capas de livros automaticamente via APIs.
    Tenta múltiplas fontes para encontrar a melhor capa disponível.
    """
    
    # URLs base das APIs
    OPEN_LIBRARY_COVER_URL = "https://covers.openlibrary.org/b"
    OPEN_LIBRARY_API = "https://openlibrary.org/api/books"
    GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
    
    @staticmethod
    def obter_capa_por_isbn(isbn):
        """
        Busca capa de livro por ISBN na Open Library (mais confiável com ISBN).
        
        Args:
            isbn: ISBN do livro
            
        Returns:
            URL da capa ou None se não encontrado
        """
        if not isbn:
            return None
        
        try:
            # Remove hífens do ISBN se houver
            isbn_limpo = isbn.replace("-", "").strip()
            
            # Tenta Open Library primeiro (melhor com ISBN)
            url_capa = f"{BookCoverService.OPEN_LIBRARY_COVER_URL}/isbn/{isbn_limpo}-M.jpg"
            
            # Verifica se a imagem existe fazendo uma requisição HEAD
            response = requests.head(url_capa, timeout=5, allow_redirects=True)
            if response.status_code == 200:
                return url_capa
                
            # Se não encontrou no tamanho M, tenta S
            url_capa_s = f"{BookCoverService.OPEN_LIBRARY_COVER_URL}/isbn/{isbn_limpo}-S.jpg"
            response = requests.head(url_capa_s, timeout=5, allow_redirects=True)
            if response.status_code == 200:
                return url_capa_s
                
        except requests.exceptions.Timeout:
            logger.warning(f"Timeout ao buscar capa por ISBN {isbn}")
        except requests.exceptions.RequestException as e:
            logger.warning(f"Erro de conexão ao buscar capa por ISBN {isbn}: {str(e)}")
        except Exception as e:
            logger.warning(f"Erro ao buscar capa por ISBN {isbn}: {str(e)}")
        
        return None
    
    @staticmethod
    def obter_capa_por_titulo_autor(titulo, autor):
        """
        Busca capa de livro por título e autor usando Google Books API.
        
        Args:
            titulo: Título do livro
            autor: Autor do livro
            
        Returns:
            URL da capa ou None se não encontrado
        """
        if not titulo:
            return None
        
        try:
            # Monta query de busca
            query = f"{titulo}"
            if autor:
                query += f" {autor}"
            
            params = {
                "q": query,
                "maxResults": 5
            }
            
            response = requests.get(BookCoverService.GOOGLE_BOOKS_API, params=params, timeout=5)
            
            if response.status_code == 200:
                dados = response.json()
                
                # Procura por livros com imagem disponível
                if "items" in dados:
                    for item in dados["items"]:
                        volume_info = item.get("volumeInfo", {})
                        image_links = volume_info.get("imageLinks", {})
                        
                        if "thumbnail" in image_links:
                            # Substitui http por https e aumenta resolução
                            url = image_links["thumbnail"].replace("http://", "https://")
                            # Aumenta o tamanho da imagem (edge=curl faz borda bonita)
                            url = url.replace("&edge=curl", "").replace("&zoom=1", "&zoom=2")
                            
                            # Verifica se a URL é válida
                            try:
                                verify_response = requests.head(url, timeout=3)
                                if verify_response.status_code == 200:
                                    return url
                            except:
                                # Se não conseguir verificar, retorna mesmo assim
                                return url
        
        except requests.exceptions.Timeout:
            logger.warning(f"Timeout ao buscar capa por título/autor ({titulo}, {autor})")
        except requests.exceptions.RequestException as e:
            logger.warning(f"Erro de conexão ao buscar capa por título/autor ({titulo}, {autor}): {str(e)}")
        except Exception as e:
            logger.warning(f"Erro ao buscar capa por título/autor ({titulo}, {autor}): {str(e)}")
        
        return None
    
    @staticmethod
    def obter_capa(isbn=None, titulo=None, autor=None):
        """
        Busca capa de livro tentando múltiplas estratégias.
        
        Ordem de prioridade:
        1. ISBN (mais confiável)
        2. Título + Autor (Google Books)
        3. Apenas Título (Google Books)
        
        Args:
            isbn: ISBN do livro (opcional)
            titulo: Título do livro (opcional)
            autor: Autor do livro (opcional)
            
        Returns:
            URL da capa ou None
        """
        # 1. Tenta por ISBN (mais preciso)
        if isbn:
            capa = BookCoverService.obter_capa_por_isbn(isbn)
            if capa:
                return capa
        
        # 2. Tenta por Título + Autor
        if titulo and autor:
            capa = BookCoverService.obter_capa_por_titulo_autor(titulo, autor)
            if capa:
                return capa
        
        # 3. Tenta apenas Título
        if titulo:
            capa = BookCoverService.obter_capa_por_titulo_autor(titulo, None)
            if capa:
                return capa
        
        return None
    
    @staticmethod
    def obter_capa_com_fallback(isbn=None, titulo=None, autor=None, url_padrao=None):
        """
        Busca capa com fallback para URL padrão.
        
        Args:
            isbn: ISBN do livro
            titulo: Título do livro
            autor: Autor do livro
            url_padrao: URL padrão se nenhuma capa for encontrada
            
        Returns:
            URL da capa ou URL padrão
        """
        capa = BookCoverService.obter_capa(isbn, titulo, autor)
        return capa if capa else url_padrao
