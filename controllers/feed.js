const getPosts = (req, res) => {
  return res.status(200).json({
    posts: [{_id:'1', creator: {name: 'Dima'}, createdAt: new Date(), title: 'first', content: 'Hello world!'}]
  })
}

const createPost = (req, res) => {
  const {title, content} = req.body
  return res.status(201).json({
    message: 'created',
    post: {
      _id: new Date(),
      title,
      content,
      creator: {name: 'Dima'},
      createdAt: new Date()
    }
  })
}

module.exports = {
  getPosts,
  createPost
}
