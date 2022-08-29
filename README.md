# 一个简单社区论坛

> 构建一个简单的频道<->消息应用,支持TDD,E2E测试，swagger（open api）文档,CI/CD

-   源码: https://git.pincman.com/employer/forum
-   API: https://forum.pincman.com/api
-   Swagger:https://forum.pincman.com/api-docs
-   构建: https://drone.pincman.com 账户: employer 密码: 123456

## 技术栈

本应用为了简单起见，使用以下技术栈

-   nestjs - 一个使用typescript构建的企业级node.js框架
-   typeorm - 一个node+ts构建的orm
-   class-validator - 用于验证ts类
-   class-transform - 用于序列化ts对象
-   sqlite - 一个简单的嵌入式数据库,如果有需要你可以换成mysql或者postgresql等任意数据库

## 开发

### 安装启动

下载源码

```shell
git clone https://github.com/pincman/forum
```

安装`pnpm`

```shell
npm install -g pnpm
```

安装应用

```shell
cd forum && pnpm i
```

启动应用并热更新

```shell
pnpm start:dev
```

### IDE配置

推荐使用Vscode配置开发环境

>   本应用的代码规范遵循airbnb标准,如果使用其它规范,譬如standard等,请自行调整

为了能身心愉悦的编辑代码，请使用以下命令安装eslint与prettier插件

```shell
code --install-extension dbaeumer.vscode-eslint \
  && code esbenp.prettier-vscode
```

### Debug

根据自己需要的调试方式,随意调整`./vscode/launch.json`文件,在任意文件打上断点,按`F5`一键Debug

### 测试接口

在Postman中导入集合(`./postman/collection.json`)和(`./postman/environment.json`)环境配置配置,并对接口进行测试,如下图![QQ20220712-103327@2x](https://pic.pincman.com/media/202207121033954.png)

又或者你可以通过访问[https://forum.pincman.com/api-docs](https://forum.pincman.com/api-docs)来访问swagger(open api)页面进行测试

![open api](https://pic.pincman.com/media/202207121424249.png)

## 部署

我目前使用的是gitea+drone的devops方式进行部署，步骤如下

-   先使用nginx创建一个虚拟主机反向映射到应用的端口
-   接着把代码push到应用的gitea的[仓库](https://git.pincman.com/employer/forum)中
-   gitea通过钩子触发drone([drone.pincman.com](https://drone.pincman.com))自动构建
-   构建进度可进入[drone](drone.pincman.com)控制面板,使用 **账户: employer,密码: 123456查看**
-   drone构建完毕自动把产出物(即`dist`包)通过ssh输送到生产服务器
-   drone在输送完编译包后,pm2将自启对应用进行部署

drone配置请参考[源代码](https://git.pincman.com/employer/forum/src/branch/main/.drone.yml)

![QQ20220712-182104@2x](https://pic.pincman.com/media/202207121821025.png)

在drone中需要设置以下字段

-   deploy_path: 生产服务器需要部署的路径
-   host: 生产服务器的IP地址
-   ssh_key: 构建服务器连接生成服务器用到的密匙(需要提前将公钥添加到生产服务器的`authorized_key`中)
-   username: 连接生产服务器的用户名

更简洁的方式

可以自行配置一个Dockerfile或者docker-compose.yml代替pm2+nginx,在drone构建后进行部署

注意事项(备注)

-   在应用比较大时中使用migration(迁移命令)来代替当前代码中的同步配置,这样在数据库结构更新后不会丢数据,迁移命令和编写方法十分简单,可参考[typeorm cli文档](https://typeorm.io/migrations#creating-a-new-migration),也可以自动利用entity生成迁移
-   尽可能使用pm2的cluster方式进行部署,这样在一个子进程挂掉的时候不会导致整个应用的崩溃

## 接口

>   也可以使用open api(swagger)进行测试,地址: [https://forum.pincman.com/api-docs](https://forum.pincman.com/api-docs),如下图

![open api](https://pic.pincman.com/media/202207121424249.png)

### 频道列表

列出所有频道

**API**

-   url: /channels
-   method: GET

**Response Data**: 频道列表数组,每个频道的字段解释请查看[频道详情](#频道详情)

![QQ20220712-112035@2x](https://pic.pincman.com/media/202207121120192.png)

### 频道详情

显示一个频道的详情

**API**

-   url: /channels/:channel_id
-   method: GET

**Response Data**

-   id: 当前频道的ID
-   name: 当前频道的名称
-   content: 当前频道的排序
-   createdAt: 当前频道下的消息数量

![QQ20220712-112609@2x](https://pic.pincman.com/media/202207121126447.png)

### 创建频道

频道名称具有唯一性,不可重复

**API**

-   url: /channels
-   method: POST

**Body**

-   name: 频道名称

**Response Data**: 请参考[频道详情](#频道详情)

![QQ20220712-112924@2x](https://pic.pincman.com/media/202207121129109.png)

频道名称重复将抛出`400`异常

![QQ20220712-113134@2x](https://pic.pincman.com/media/202207121131777.png)

### 更新频道

频道名称具有唯一性,如果已存在则抛出`400`异常

**API**

-   url: /channels
-   method: PATCH

**Body**

-   id: 频道ID
-   name: 频道名称

**Response Data**: 请参考[频道详情](#频道详情)

![QQ20220712-113430@2x](https://pic.pincman.com/media/202207121134422.png)

频道名称重复异常

![QQ20220712-113459@2x](https://pic.pincman.com/media/202207121135689.png)

### 删除频道

>   删除频道的同时会删除其下的所有消息

**API**

-   url: /channels/:channel_id
-   method: DELETE

**Response Data**: 请参考[频道详情](#频道详情)

![QQ20220712-113829@2x](https://pic.pincman.com/media/202207121138121.png)

### 消息列表

按创建时间排序,支持分页,支持通过频道过滤,消息内容自动通过防xss处理,标题自动去除html标签

**API**

-   url: /messages
-   method: GET

**Params**

-   page: 当前页
-   limit: 每页显示消息数量
-   channel: 只查找指定频道下的消息,通过频道ID指定

**Response Data** 

-   items: 查询出的消息列表,每个消息的字段解释请查看[消息详情](#消息详情)
-   meta.totalItems: 符合条件的消息的总数量
-   meta.itemCount: 当前页显示数量
-   meta.itemsPerPage: 每一页显示的消息数量
-   meta.totalPages: 总页数
-   meta.currentPage: 当前页

如图

![QQ20220712-111508@2x](https://pic.pincman.com/media/202207121115274.png)

### 消息详情

消息内容自动通过防xss处理,标题自动去除html标签

**API**

-   url: /messages/:message_id
-   method: GET

**Response Data** 

-   id: 当前消息的ID
-   title: 当前消息的标题
-   content: 当前消息的内容
-   createdAt: 当前消息的创建时间

![QQ20220712-113926@2x](https://pic.pincman.com/media/202207121139369.png)

###  新增消息

**API**

-   url: /messages
-   method: POST

**Body**

-   title: 消息标题
-   content: 消息内容
-   channel: 频道ID

**Response Data**: 请参考[消息详情](#消息详情)

新增消息(必须通过`channel`字段指定分类),对`content`字段自动过滤部分`html`标签以防止xss攻击,对`title`清除全部`html`标签,如下图

![QQ20220712-104634@2x](https://pic.pincman.com/media/202207121046392.png)

### 更新消息

**API**

-   url:/messages
-   method:PATCH

**Body**

-   id: 消息ID
-   title: 消息标题
-   content: 消息内容
-   channel: 频道ID

**Response Data**: 请参考[消息详情](#消息详情)

更新消息可重设`title`,`content`以及关联的`channel`,如图![QQ20220712-105225@2x](https://pic.pincman.com/media/202207121052249.png)

### 删除消息

**API**

-   url: /messages/:message_id
-   method:DELETE

**Response Data**: 请参考[消息详情](#消息详情)

删除消息,并返回相应的数据库对象,如图![QQ20220712-105225@2x](https://pic.pincman.com/media/202207121058577.png)

## 编码

### 文件结构

```shell
src
├── app.controller.ts                         #框架默认文件(可废弃)
├── app.module.ts                             #框架默认文件(可废弃)
├── app.service.ts                            #框架默认文件(可废弃)
├── config
│   └── database.config.ts                    #数据库配置文件
├── database
│   └── database.sqlite                       #sqlite数据库文件
├── main.ts                                   #应用的启动引导文件
└── modules
    ├── core                                  #核心包
    │   ├── constants.ts                      #常量文件
    │   ├── constraints
    │   ├── core.module.ts                    #核心模块
    │   ├── decorators                        #装饰器集合
    │   ├── helpers.ts                        #一些帮助函数
    │   ├── providers                         #自定义的全局验证管道,序列化拦截器和异常处理过滤器
    │   └── types.ts                          #全局的类型
    └── forum                                 #社区逻辑业务包
        ├── forum.module.ts                   #社区模块
        ├── controllers                       #控制器
        ├── dtos                              #请求数据验证DTO
        ├── entities                          #实体模型
        ├── repositories                      #操作数据的自定义存储类
        ├── services                          #服务类
        └── subscribers                       #用于执行查询钩子的订阅者类
```

### 新增模块

模块的具体代码写法请参考`ForumModule`

一，新增一个模块，比如`ContentModule`

```typescript
// src/modules/content.module.ts
@Module({})
export class ForumModule {}
```

二，新增一个模型，比如`PostEntity`

-   `@Exclude`装饰器默认在响应中排除所有属性
-   `@Expose`装饰器用于指定响应数据中需要暴露的属性，可以设置组

```typescript
// src/modules/content/entities/post.entity.ts
@Exclude()
@Entity('content_posts')
export class PostEntity extends BaseEntity {
    @Expose({ groups: ['post-list', 'post-detail'] })
    @Column({ comment: '文章标题' })
    title!: string;
}
```

三,新增一个自定义存储类,比如`PostRepository`,用于构建基础的`QueryBuilder`

>   需要使用核心包中的`@CustomRepository`装饰器来装饰

```typescript
// src/modules/content/entities/user.repository.ts
@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
}
```

四,新增一个用于数据验证的`DTO`类的列表

-   `@DtoValidation`:一个在核心包中自定义的装饰器,用于自动验证管道
-   `@ApiProperty`和`@ApiPropertyOptional`用于暴露给Open API使用,请参考nestjs文档
-   ` @Transform`用于转义请求数据类型,请参考class-transform文档
-   `@Min`等验证规则请参考`class-validator`文档

```typescript
// src/modules/content/dtos/post.dto.ts
@Injectable()
@DtoValidation({ type: 'query' })
export class QueryPostDto implements PaginateDto {}

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreatePostDto {}	

@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends PartialType(CreatePostDto) {}
```

五,新增一个服务用于操作数据,比如`PostService`

```typescript
// src/modules/content/services/post.service.ts
@Injectable()
export class PostService {
    constructor(
        protected postRepository: PostRepository,

    ) {}
    async list(params: FindParams, options: IPaginationOptions) {
    }
    async findOne(id: string) {
    }
    async create(data: CreatePostDto) {
    }

    async update(data: UpdatePostDto) {
    }
    async delete(id: string) {
    }
}

```

六,新增一个控制器用于接口路由,比如`PostController`

>   `SerializeOptions`装饰器里配置的组请与`entity`里的对应

```typescript
// src/modules/content/post.controller.ts
@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}
    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    async index() {
        return this.postService.list();
    }
}
```

七,在`ContentModule`中注册以上的模型,服务,控制器等

>   用于注册自定义存储类的`forRepository`是核心模块中自定义的静态方法

```typescript
// src/modules/content.module.ts
Module({
    imports: [TypeOrmModule.forFeature(entities),CoreModule.forRepository(repositories)],
    providers: [...services, ...dtos, ...subscribers],
    controllers,
    exports: [...services, CoreModule.forRepository(repositories)],
})
export class ContentModule {}
```

八,最后在`AppModule`中导入`ContentModule`

```typescript
// src/app.module.ts
@Module({
    imports: [ContentModule, CoreModule.forRoot(database())],
})
export class AppModule {}
```

### 自动化测试

TDD测试编写请参考`src/modules/forum/controllers/channel.controller.spec.ts`

E2E测试编写请参考`test/app.e2e-spec.ts`

无论是TDD还是E2E测试，请在配置文件加上**path alias**

```json
// jest-e2e.json
{
    ...
    "moduleNameMapper": {
        "@/(.*)": "<rootDir>/../src/$1"
    }
}
// package.json
  "jest": {
       ...
        "moduleNameMapper": {
            "@/(.*)": "<rootDir>/$1"
        }
   },
```

运行测试命令

TDD: `pnpm test:watch `,E2E: `pnpm test:e2e`

![QQ20220712-181941@2x](https://pic.pincman.com/media/202207121819490.png)

### 异常处理

与自动验证和自动序列化一样(这两个类的使用方法请参考源代码中的注释),都是在`CoreModule`中实现的全局类,自动异常处理类用于对原本抛出的异常进行自定义处理,以便转换为`Http`异常

在`AppFilter`类中的`resExceptions`属性中添加你需要进行响应转换的异常类和对应的响应码

例如下面的代码把默认抛出`500` 异常的TypeORM的`EntityNotFoundError`转换成`404`

```typescript
@Catch()
export class AppFilter<T = Error> extends BaseExceptionFilter<T> {
    protected resExceptions = [
        { class: EntityNotFoundError, status: HttpStatus.NOT_FOUND },
    ];
}
```
