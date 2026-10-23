// Respuestas JSON estandarizadas en toda la API.
function ok(res, { status = 200, message = 'OK', data = null } = {}) {
  return res.status(status).json({ success: true, message, data });
}

function fail(res, { status = 400, message = 'Error', errors = null } = {}) {
  return res.status(status).json({ success: false, message, errors });
}

module.exports = { ok, fail };
