## Cookie
If FRONTEND_URL is not under http://localhost:3000, then it is not possible to set a cookie from your redirect response that will be visible at FRONTEND_URL. This is because web browsers will only allow a cookie to be set on the same domain as the request was on. Your cookie is very likely being set, but since you then redirect to a different domain, that cookie set on http://localhost:3000 is not going to be accessible / visible, since it is a different domain.