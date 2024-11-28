import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaPlus, FaAngleLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import placeholderImg from '../../assets/placeholder.jpg';
import api from "../../services/api";
import './filme.css'

function Filme() {
    const { id } = useParams() 
    const browser = useNavigate()
    const [filme, setFilme] = useState({})
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        async function loadFilme() {
            await api.get(`movie/${id}`)
                .then((response) => {
                    setFilme(response.data)
                    setLoading(false)
                })
                .catch(() => {
                    browser('/', { replace: true })
                    return
                })
        }
        
        loadFilme()
    }, [id, browser])

    function timeConvert(minutes) {
        let hours = Math.floor(minutes / 60)
        let minute =  minutes % 60

        hours = hours < 10 ? '0' + hours : hours
        minute = minute < 10 ? '0' + minute : minute

        return `${hours} h ${minute} min`
    }

    function saveMovie() {
        const list = localStorage.getItem('@movieflix')
        let savedMovie = JSON.parse(list) || []

        const hasMovie = savedMovie.some(movie => movie.id === filme.id)

        if (hasMovie) {
            toast.warn('Este filme já está na sua lista!')
            return
        }

        savedMovie.push(filme)
        localStorage.setItem('@movieflix', JSON.stringify(savedMovie))
        toast.success('Filme salvo com sucesso!')
    }

    if (loading) {
        return (
            <div className="load-filme">
                <h2>Carregando detalhes...</h2>
            </div>
        )
    }

    return (
        <div className="detalhes" style={ {backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url('https://image.tmdb.org/t/p/original/${filme.backdrop_path}')`}}>
            <div className="container">
                <Link className="home" to="/"><span><FaAngleLeft/></span>Home</Link>
                <div className="detalhes-film">
                    <div className="detalhes-info">
                        <h1>{filme.title}</h1>
                        <p className="genres">{filme.genres.map(genre => genre.name).join(', ')}</p>
                        <p className="runtime">{filme.release_date.slice(0, 4)} &sdot; {timeConvert(filme.runtime)}</p>

                        <div className="sinopse">
                            <p>{filme.overview}</p>
                        </div>

                        <div className="detalhes-btn">
                            <a target="blank" rel="external" href={`https://www.youtube.com/results?search_query=${filme.title} trailer`}>Trailer</a>
                            <button onClick={saveMovie}><FaPlus className="plus-icon" /> Salvar</button>
                        </div>
                    </div>

                    {
                        filme.poster_path !== null ? (
                            <LazyLoadImage 
                                src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`} 
                                alt={filme.title} 
                                title={filme.title}
                                effect="blur"
                                placeholderSrc={placeholderImg}
                            />
                        ) : (
                            <img 
                                src={placeholderImg} 
                                alt={filme.title} 
                                title={filme.title}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Filme;