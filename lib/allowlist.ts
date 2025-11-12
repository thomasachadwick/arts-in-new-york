export const VENUE_ALLOW = [
  'carnegie hall','david geffen hall','metropolitan opera house','alice tully hall','bargemusic','town hall',
  'juilliard','merkin concert hall','colden auditorium','brooklyn academy of music','92nd street y',
  'lyceum theatre','al hirschfeld theatre','stephen sondheim theatre','palace theatre','gershwin theatre',
  'august wilson theatre','belasco theatre','stage 42','westside theatre','minetta lane theatre',
  'lucille lortel theatre','daryl roth theatre','atlantic theater company','astor place theatre',
  'asylum nyc','la mama','the tank','new york theatre workshop','signature theatre','soho rep',
  'playwrights horizons','the public theater','st. ann’s warehouse','st. anns warehouse'
];
export function allowed(venue?: string){
  if (!venue) return false;
  const v = venue.toLowerCase();
  return VENUE_ALLOW.some(a => v.includes(a));
}