const XLSX = require( "xlsx" );

let date = new Date(),
  today = `${date.getDate() }-${ date.getMonth() + 1 }-${ date.getFullYear()}`;

module.exports = ( data, type = "xlsx", options = {} ) => {
  let workbook = XLSX.utils.book_new(),
    reportSheet = XLSX.utils.json_to_sheet( data ),
    filename = `Export-${today}`;

  if ( options.filename ) {
    filename = options.filename;
  }
  
  XLSX.utils.book_append_sheet( workbook, reportSheet );
  switch ( type ) {
    case "xlsx": filename = `${filename}.xlsx`; break;
    case "csv": filename = `${filename}.csv`; break;
    default: break;
  }
  XLSX.writeFile( workbook, filename, { "bookType": type } );
  return filename;
};
