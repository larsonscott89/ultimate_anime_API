const Genre = require('../models/genre')
const AnimeName = require('../models/animeName')
const CharacterInfo = require('../models/characterInfo')

const createGenre = async (req, res) => {
  try {
    const genre = await new Genre(req.body)
    await genre.save()
    return res.status(201).json({
        genre
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getGenre = async (req, res) => {
  try {
    const genre = await Genre.find()
    res.json(genre)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getGenreDetails = async (req, res) => {
  try {
    const { name } = req.params
    const regex = new RegExp(name, 'i')
    const genre = await Genre.findOne({ type: { $regex: regex } })

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' })
    }

    const anime = await AnimeName.find({ genre_id: genre._id })

    const genreDetails = {
      genre,
      anime: anime.map(anime => anime.name),
    }

    res.json(genreDetails)
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getAnimeByGenre = async (req, res) => {
  try {
    const { name } = req.params
    const regex = new RegExp(name, 'i')
    const genre = await Genre.findOne({ type: { $regex: regex } })

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' })
    }

    const anime = await AnimeName.find({ genre_id: genre._id })

    res.json(anime.map(anime => anime.name))
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const updateGenre = async (req, res) => {
  try {
    let { id } = req.params
    let genre = await Genre.findByIdAndUpdate(id, req.body, { new: true})
    if (genre) {
      return res.status(200).json(genre)
    }
  } catch (e) {
    return res.status(500).json({ error: error.message})
  }
}


const deleteGenre = async (req, res) => {
  try {
      const { id } = req.params
      const deleted = await Genre.findByIdAndDelete(id)
      if (deleted) {
          return res.status(200).send("Genre deleted")
      }
      throw new Error("Genre not found")
  } catch (error) {
      return res.status(500).send(error.message)
  }
}

module.exports = {
  getGenre,
  getGenreDetails,
  getAnimeByGenre,
  createGenre,
  updateGenre,
  deleteGenre
}