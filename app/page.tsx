'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaHeart, FaHeartBroken } from 'react-icons/fa'; // Importando os ícones de seta e coração

interface Post {
  id: number;
  title: string;
  body: string;
}

const Home = () => {
  // Estado para armazenar os posts, posts curtidos e a página atual
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1); // Estado para a página atual

  // Buscar os posts da API
  const fetchPosts = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const postsData: Post[] = await res.json();
    setPosts(postsData); // Armazenar os posts no estado
  };

  useEffect(() => {
    fetchPosts(); // Buscar os posts quando o componente for montado
  }, []);

  // Alternar o status de curtida
  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(id)) {
        newLikedPosts.delete(id);
      } else {
        newLikedPosts.add(id);
      }
      return newLikedPosts;
    });
  };

  // Mostrar apenas 1 post por página
  const postsPerPage = 1; // Apenas 1 post por página
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Calcular o número total de páginas
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Contagem total de curtidas
  const totalLikes = likedPosts.size;

  // Manipular o clique do botão "Próximo"
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Manipular o clique do botão "Anterior"
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="bg-white p-6 w-full max-w-3xl rounded-lg shadow-lg">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-6">Artigos Recentes</h1>

        {/* Exibindo o total de curtidas */}
        <div className="mb-6 text-center text-lg font-semibold text-green-500">
          <p>Quantia Total de Reações: {totalLikes}</p>
        </div>

        <ul className="space-y-6">
          {currentPost.map((post) => (
            <li key={post.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-xl transform hover:translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.body}</p>
              <div className="flex justify-start">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`p-3 rounded-md font-semibold transition-all duration-300 ${
                    likedPosts.has(post.id)
                      ? 'text-pink-500 hover:text-pink-600'
                      : 'text-gray-500 hover:text-gray-600'
                  }`}
                >
                  {likedPosts.has(post.id) ? (
                    <FaHeart className="text-2xl" />
                  ) : (
                    <FaHeartBroken className="text-2xl" />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Botões de navegação com ícones de seta */}
        <div className="flex justify-between items-center mt-6">
          {/* Botão "Anterior" */}
          <button
            onClick={prevPage}
            className="p-4 bg-gray-500 text-white rounded-md disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            <FaChevronLeft className="text-xl" />
          </button>

          {/* Contador de páginas */}
          <span className="text-lg font-semibold text-gray-700">
            Página {currentPage} de {totalPages}
          </span>

          {/* Botão "Próximo" */}
          <button
            onClick={nextPage}
            className="p-4 bg-teal-500 text-white rounded-md disabled:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
