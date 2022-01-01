model:

user:name(3,20),email,password(8,30),description

article:title(1,10),description(1),body,author

jwt头是token

api:

get /users/:id 获取用户信息

post /users 注册用户

get /articles 获得所有文章

get /articles/:id 获得文章信息

post /articles 新建文章

post /auth 登录

