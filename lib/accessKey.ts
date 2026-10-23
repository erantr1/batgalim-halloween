// Seeing the map needs a registration. Each host or viewer registration sends a random key, kept in
// this cookie; /map passes it to map_points(), which checks it against the registration rows.
export const accessKeyCookie = "access_key";
