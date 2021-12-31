const fs = require('fs');

const unlinkFile = (filePathInPublic) => {
  try {
    if (fs.existsSync(`public/${filePathInPublic}`)){
      console.log('exist avatar');
  
      fs.unlink(`public/${filePathInPublic}`, (err) => {
        if (err) console.log(err);
        else console.log(`${filePathInPublic} was deleted`);
      });
    }  
  } catch (err) {}
}

module.exports = unlinkFile;

