const connectToDatabase = require('./db')

function HTTPError (statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

module.exports.healthCheck = async () => {
  await connectToDatabase()
  console.log('Connection successful.')
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' })
  }
}

module.exports.create = async (event) => {
  try {
    const { Diary } = await connectToDatabase()
    const diary = await Diary.create(JSON.parse(event.body))
    return {
      statusCode: 200,
      body: JSON.stringify(diary)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the diary.'
    }
  }
}

module.exports.getOne = async (event) => {
  try {
    const { Diary } = await connectToDatabase()
    const diary = await Diary.findByPk(event.pathParameters.id)
    if (!diary) throw new HTTPError(404, `Diary with id: ${event.pathParameters.id} was not found`)
    return {
      statusCode: 200,
      body: JSON.stringify(diary)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not fetch the Diary.'
    }
  }
}

module.exports.getAll = async () => {
  try {
    const { Diary } = await connectToDatabase()
    const diaries = await Diary.findAll()
    return {
      statusCode: 200,
      body: JSON.stringify(diaries)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the diaries.'
    }
  }
}

module.exports.update = async (event) => {
  try {
    const input = JSON.parse(event.body)
    const { Diary } = await connectToDatabase()
    const diary = await Diary.findByPk(event.pathParameters.id)
    if (!diary) throw new HTTPError(404, `Diary with id: ${event.pathParameters.id} was not found`)
    if (input.title) diary.title = input.title
    if (input.description) diary.description = input.description
    await diary.save()
    return {
      statusCode: 200,
      body: JSON.stringify(diary)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not update the Diary.'
    }
  }
}

module.exports.destroy = async (event) => {
  try {
    const { Diary } = await connectToDatabase()
    const diary = await Diary.findByPk(event.pathParameters.id)
    if (!diary) throw new HTTPError(404, `Diary with id: ${event.pathParameters.id} was not found`)
    await diary.destroy()
    return {
      statusCode: 200,
      body: JSON.stringify(diary)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could destroy fetch the Diary.'
    }
  }
}