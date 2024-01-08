const notFound = (req, res) => res.status(404).json({ err: 'Router does not exist.' });

module.exports = notFound;
