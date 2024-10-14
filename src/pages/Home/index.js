import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import {Swiper, SwiperSlide} from "swiper/react";
import { EffectFade } from "swiper/modules";
import { FaSearch } from 'react-icons/fa';
import { LazyLoadImage } from "react-lazy-load-image-component";
import placeholderImg from '../../assets/placeholder.jpg';
import api from "../../services/api";
import './home.css'

function Home() {
    const [filmes, setFilmes] = useState([])
    const [slider, setSlider] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)

    function formatDate(value) {
        if (!value) return "Não disponível"

        const format = {
            timeZone: 'America/Sao_Paulo',
            hour12: true,
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }

        const date = new Date(value)
        return date.toLocaleDateString('pt-br', format)
    }

    function handleChange(e) {
        setSearch(e.target.value)
        setCurrentPage(1)
        console.log(filmes, 'aqui')
    }

    function handleSubmit(e) {
        e.preventDefault()
        setSearch(search)
        setCurrentPage(1)
    }

    useEffect(() => {
        async function loadFilmes() {

            const url = !search ? "movie/now_playing" : "search/movie"
            const params = {
                params: {
                    page: currentPage
                }
            }

            if (search) {
                params.params.query = search
            }

            const response = await api.get(url, params)

            const { results, total_pages } = response.data

            setTotalPages(total_pages)

            if (currentPage === 1 && !search) {
                setSlider(results.slice(0, 5))
            }
            
            setFilmes((prevFilmes) => currentPage === 1 ? results : [...prevFilmes, ...results])
            setLoading(false)
        }
        loadFilmes()
    }, [currentPage, search])

    useEffect(() => {
        function loadMoreFilmes() {
            if (totalPages > currentPage) {
                setCurrentPage((currentPage) => currentPage + 1)
            }
        }
        function handleScroll() {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    
            if (scrollTop + clientHeight >= scrollHeight) {
                loadMoreFilmes()
            }
        }
        window.addEventListener("scroll", handleScroll);
        
        return () => window.removeEventListener("scroll", handleScroll)
    }, [currentPage, totalPages])

    if (loading) {
        return (
            <div className="loading">
                <h2>Carregando filmes...</h2>
            </div>
        )
    }

    return (
        <div className="home">
            <div className="container">
                <Swiper
                    modules={[EffectFade]}
                    effect="fade"
                    slidesPerView={1}
                    pagination={{clickable: true}}
                    navigation
                    autoplay={{delay:8000}}
                >
                    {slider.map(item => {
                        return (
                            <SwiperSlide key={item.id}>
                                <div className="slide-item">
                                    <img src={`https://image.tmdb.org/t/p/original/${item.backdrop_path}`} alt={item.title}/>
                                    <div className="slide-detalhes">
                                        <span>{formatDate(item.release_date)}</span>
                                        <h2>{item.title}</h2>
                                        <Link className="btn-detalhes" to={`filme/${item.id}`}>Detalhes</Link>
                                        <a className="btn-trailer" target="blank" rel="external" href={`https://www.youtube.com/results?search_query=${item.title} trailer`}>Trailer</a>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>

                <form onSubmit={handleSubmit}>
                    <label className="input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            className="search"
                            type="shearch"
                            name="shearch"
                            onChange={handleChange}
                            placeholder="Buscar por um filme"
                            value={search}
                        />
                    </label>
                </form>
                <div className="lista-filmes">
                    {filmes.map((filme) => {
                        return (
                            <article key={filme.id}>
                                <Link to={`filme/${filme.id}`}>
                                    <span className="vote">{filme.vote_average.toFixed(1)}</span>
                                    {
                                        filme.poster_path !== null ? (
                                            <LazyLoadImage 
                                                effect="blur"
                                                src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`} 
                                                alt={filme.title} 
                                                placeholderSrc={placeholderImg}
                                            />
                                        ) : (
                                            <img 
                                                src={placeholderImg}
                                                alt={filme.title}
                                            />
                                        )
                                    }
                                    
                                    <p>{formatDate(filme.release_date)}</p>
                                    <strong title={filme.title}>{filme.title.substring(0, 30)} {filme.title.length > 30 && '...'}</strong>
                                </Link>
                            </article>
                        )
                    })}
                </div>

                {filmes.length === 0 && (
                    <div className="search_erro">
                        <h2>Nenhum filme encontrado...</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;