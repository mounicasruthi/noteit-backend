exports.handleNoteIdParam = (req, res, next, id) => {
    req.noteId = id;
    next();
  };