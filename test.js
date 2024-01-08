const { Edupage } = require('edupage-api');

let test = async () => {
  const edupage = new Edupage();
  await edupage.login('IslamMammadov', 'edU4169Page!');
  console.log(edupage.user.class.name);
  edupage.exit();
};

test();
