-- Ground-floor homes: no stairs and no elevator (decided 28.10). Run before deploying the form that offers it.

alter type access_type add value if not exists 'ground' before 'stairs';
