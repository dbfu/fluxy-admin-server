/*
 Navicat Premium Dump SQL

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : fluxy-admin

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 24/12/2024 17:24:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for casbin_rule
-- ----------------------------
DROP TABLE IF EXISTS `casbin_rule`;
CREATE TABLE `casbin_rule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ptype` varchar(255) DEFAULT NULL,
  `v0` varchar(255) DEFAULT NULL,
  `v1` varchar(255) DEFAULT NULL,
  `v2` varchar(255) DEFAULT NULL,
  `v3` varchar(255) DEFAULT NULL,
  `v4` varchar(255) DEFAULT NULL,
  `v5` varchar(255) DEFAULT NULL,
  `v6` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of casbin_rule
-- ----------------------------
BEGIN;
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (78, 'g', NULL, '5172863325700096', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (79, 'g', NULL, '5126498239381504', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (83, 'g', NULL, '5126498239381504', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (84, 'g', NULL, '5126498239381504', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (86, 'g', NULL, '159235485007347712', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (87, 'g', NULL, '5126498239381504', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (88, 'g', '1', '1637123031564288', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (89, 'g', NULL, '1637123031564288', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (92, 'g', NULL, '5126498239381504', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (105, 'p', '1637123031564288', '/menu/alloc/interface/list', 'get', '15457927204700160', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (106, 'p', '1637123031564288', '/role/page', 'get', '15694607522201600', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (107, 'p', '1637123031564288', '/menu/page', 'get', '15459106626207744', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (108, 'p', '1637123031564288', '/menu/alloc/interface/list', 'get', '15459106626207744', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (109, 'p', '1637123031564288', '/menu/children', 'get', '15459106626207744', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (110, 'p', '1637123031564288', '/menu/', 'post', '19977176791121920', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (111, 'p', '1637123031564288', '/user/send/email/captcha', 'post', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (112, 'p', '1637123031564288', '/user/page', 'get', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (113, 'p', '1637123031564288', '/user/', 'post', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (114, 'p', '1637123031564288', '/user/', 'put', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (115, 'p', '1637123031564288', '/user/:id', 'delete', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (116, 'p', '1637123031564288', '/user/:id', 'get', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (117, 'p', '1637123031564288', '/role/alloc/menu', 'post', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (118, 'p', '1637123031564288', '/role/menu/list', 'get', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (119, 'p', '1637123031564288', '/role/page', 'get', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (120, 'p', '1637123031564288', '/role/list', 'get', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (121, 'p', '1637123031564288', '/role/', 'post', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (122, 'p', '1637123031564288', '/role/', 'put', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (123, 'p', '1637123031564288', '/role/:id', 'delete', '19974159782117376', NULL, NULL, NULL);
INSERT INTO `casbin_rule` (`id`, `ptype`, `v0`, `v1`, `v2`, `v3`, `v4`, `v5`, `v6`) VALUES (133, 'g', '1999360162267136', '5126498239381504', NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of migrations
-- ----------------------------
BEGIN;
INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES (1, 1686884629903, 'Migration1686884629903');
INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES (2, 1686932125474, 'Migration1686932125474');
COMMIT;

-- ----------------------------
-- Table structure for sys_api_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_api_log`;
CREATE TABLE `sys_api_log` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `url` varchar(255) NOT NULL COMMENT '接口url',
  `method` varchar(255) NOT NULL COMMENT '请求方式',
  `success` tinyint NOT NULL COMMENT '是否成功',
  `startTime` datetime NOT NULL COMMENT '开始时间',
  `endTime` datetime NOT NULL COMMENT '结束时间',
  `duration` int NOT NULL COMMENT '耗时',
  `ip` varchar(255) NOT NULL COMMENT '请求ip',
  `errorType` varchar(255) DEFAULT NULL COMMENT '错误类型',
  `result` longtext COMMENT '响应结果',
  `body` longtext COMMENT '请求body参数',
  `query` longtext COMMENT '请求query参数',
  `userId` varchar(255) DEFAULT NULL COMMENT '用户Id',
  `errorMsg` varchar(255) DEFAULT NULL COMMENT '错误消息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_api_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_file
-- ----------------------------
DROP TABLE IF EXISTS `sys_file`;
CREATE TABLE `sys_file` (
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `fileName` varchar(255) NOT NULL COMMENT '文件名',
  `filePath` varchar(255) NOT NULL COMMENT '文件路径',
  `pkName` varchar(255) DEFAULT NULL COMMENT '外健名称',
  `pkValue` varchar(255) DEFAULT NULL COMMENT '外健值',
  `id` bigint NOT NULL COMMENT '主键',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_file
-- ----------------------------
BEGIN;
INSERT INTO `sys_file` (`createDate`, `updateDate`, `fileName`, `filePath`, `pkName`, `pkValue`, `id`) VALUES ('2023-06-27 12:21:10.888416', '2023-06-27 12:24:44.000000', '1687868470874_242091682079921_.pic_hd.jpg', '/file/fluxy-admin/1687868470874_242091682079921_.pic_hd.jpg', 'user_avatar', '1999360162267136', 1998463730450432);
COMMIT;

-- ----------------------------
-- Table structure for sys_login_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_login_log`;
CREATE TABLE `sys_login_log` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userName` varchar(255) NOT NULL COMMENT '用户名',
  `ip` varchar(255) NOT NULL COMMENT '登录ip',
  `address` varchar(255) NOT NULL COMMENT '登录地点',
  `browser` varchar(255) NOT NULL COMMENT '浏览器',
  `os` varchar(255) NOT NULL COMMENT '操作系统',
  `status` tinyint NOT NULL COMMENT '登录状态',
  `message` varchar(255) NOT NULL COMMENT '登录消息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_login_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `type` int NOT NULL COMMENT '类型，1:目录 2:菜单 3:按钮 4:低代码页面',
  `url` varchar(255) DEFAULT NULL COMMENT 'url',
  `show` tinyint NOT NULL COMMENT '是否在菜单中显示',
  `filePath` varchar(255) DEFAULT NULL COMMENT '本地组件地址',
  `orderNumber` int DEFAULT NULL COMMENT '排序号',
  `parentId` varchar(255) DEFAULT NULL COMMENT '上级id',
  `route` varchar(255) DEFAULT NULL COMMENT '路由',
  `authCode` varchar(255) DEFAULT NULL COMMENT '按钮权限代码',
  `curVersion` varchar(255) DEFAULT NULL COMMENT '低代码页面当前版本号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (1620378745044992, '2023-06-26 11:18:48.406443', '2023-07-08 06:44:38.639109', '系统管理', 'SettingOutlined', 1, NULL, 1, NULL, 20, NULL, '/system', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (1620785110188032, '2023-06-26 11:20:25.287094', '2023-07-08 06:44:38.652713', '用户管理', 'UserOutlined', 2, '/user', 1, '/user/index.tsx', 20, '1620378745044992', '/user', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (2379818528145408, '2023-06-28 13:36:32.959907', '2023-07-08 06:44:38.660025', '角色管理', 'TeamOutlined', 2, '/role', 1, '/role/index.tsx', 10, '1620378745044992', '/role', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (2380054151561216, '2023-06-28 13:37:29.132116', '2023-07-08 06:44:38.665270', '菜单管理', 'MenuOutlined', 2, '/menu', 1, '/menu/index.tsx', 0, '1620378745044992', '/menu', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (2709189189173248, '2023-06-29 11:25:21.041436', '2023-07-08 06:44:38.668945', '仪表盘', 'DashboardOutlined', 2, '/dashboard', 1, '/dashboard/index.tsx', 10, NULL, '/dashboard', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (5833499856601088, '2023-07-08 02:20:14.753300', '2023-07-08 06:44:38.684209', '菜单测试', 'SlackOutlined', 2, NULL, 1, '/test/index.tsx', 10, '5833177725665280', '/menu-test-index', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (5847213443907584, '2023-07-08 03:14:44.323362', '2023-07-08 06:44:38.687493', '详情', 'FastForwardOutlined', 2, NULL, 0, '/test/detail/index.tsx', 10, '5833499856601088', '/detail', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (5854701983629312, '2023-07-08 03:44:29.733886', '2023-07-08 06:45:18.489157', '详情有参数', NULL, 2, NULL, 0, '/test/detila-params/index.tsx', 10, '5833499856601088', '/detail/:id', '', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (6632374573989888, '2023-07-10 07:14:41.328552', '2023-07-10 12:51:18.000000', '新建', NULL, 3, NULL, 0, NULL, NULL, '5833499856601088', NULL, 'menu-test:create', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (6757857844264960, '2023-07-10 15:33:18.870652', '2023-07-10 15:33:18.870652', '查询', NULL, 3, NULL, 0, NULL, NULL, '5833499856601088', NULL, 'menu-test:query', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (6758006012248064, '2023-07-10 15:33:54.195561', '2023-07-10 15:33:54.195561', '编辑', NULL, 3, NULL, 0, NULL, NULL, '5833499856601088', NULL, 'menu-test:edit', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (6758078640816128, '2023-07-10 15:34:11.510162', '2023-07-10 15:34:11.510162', '删除', NULL, 3, NULL, 0, NULL, NULL, '5833499856601088', NULL, 'menu-test:delete', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (9978851039903744, '2023-07-19 12:52:23.489225', '2023-07-19 12:52:56.439103', '用户登录日志', 'BarcodeOutlined', 2, NULL, 1, '/login-log/index.tsx', 30, '1620378745044992', '/login-log', NULL, NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (15457927204700160, '2023-08-03 15:44:17.046051', '2023-08-03 15:44:17.046051', '查询', NULL, 3, NULL, 0, NULL, NULL, '2380054151561216', NULL, 'menu:query', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (15459106626207744, '2023-08-03 15:48:58.241544', '2023-08-03 15:48:58.241544', '查询1', NULL, 3, NULL, 0, NULL, NULL, '2380054151561216', NULL, 'menu:query1', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (15694607522201600, '2023-08-04 07:24:46.031278', '2023-08-04 07:24:46.031278', '查询', NULL, 3, NULL, 0, NULL, NULL, '2379818528145408', NULL, 'role:query', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (19974159782117376, '2023-08-16 02:50:10.805673', '2023-08-16 02:50:10.805673', '全部', NULL, 3, NULL, 0, NULL, NULL, '1620785110188032', NULL, 'user:all', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (19977176791121920, '2023-08-16 03:02:10.107636', '2023-08-16 03:02:10.107636', '新建', NULL, 3, NULL, 0, NULL, NULL, '2380054151561216', NULL, 'menu:create', NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (61801171353862144, '2023-12-09 12:55:47.464661', '2023-12-19 13:31:29.000000', '页面管理', 'FileOutlined', 2, NULL, 1, '/low-code/page/list/index.tsx', 20, '61800856361631744', '/page', NULL, NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (61826177869807616, '2023-12-09 14:35:09.482291', '2023-12-20 09:16:39.000000', '新建页面', NULL, 2, NULL, 0, '/low-code/page/new/index.tsx', 10, '61801171353862144', '/new-page', NULL, NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (65732465561436160, '2023-12-20 09:17:21.043472', '2023-12-20 09:17:53.000000', '编辑页面', NULL, 2, NULL, 0, '/low-code/page/edit/index.tsx', 20, '61801171353862144', '/edit-page/:versionId', NULL, NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (65836338502434816, '2023-12-20 16:10:06.286189', '2023-12-20 16:10:06.286189', '复制页面', NULL, 2, NULL, 0, '/low-code/page/copy/index.tsx', 30, '61801171353862144', '/copy-page/:versionId', NULL, NULL);
INSERT INTO `sys_menu` (`id`, `createDate`, `updateDate`, `name`, `icon`, `type`, `url`, `show`, `filePath`, `orderNumber`, `parentId`, `route`, `authCode`, `curVersion`) VALUES (197905447867383808, '2024-12-19 02:45:35.678668', '2024-12-19 02:45:35.678668', 'API请求日志', 'FileOutlined', 2, NULL, 1, '/api-log/index.tsx', 50, '1620378745044992', '/api-log', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_menu_api
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_api`;
CREATE TABLE `sys_menu_api` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `menuId` varchar(255) NOT NULL COMMENT '菜单id',
  `method` varchar(255) NOT NULL COMMENT '请求方式',
  `path` varchar(255) NOT NULL COMMENT 'path',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_menu_api
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750656, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'post', '/auth/send/reset/password/email');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750657, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'post', '/auth/reset/password');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750658, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'post', '/auth/refresh/token');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750659, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'get', '/auth/current/user');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750660, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'get', '/auth/publicKey');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750661, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'get', '/auth/captcha');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750662, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'post', '/auth/logout');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15358008183750663, '2023-08-03 09:07:14.491548', '2023-08-03 09:07:14.491548', '15358008116641792', 'post', '/auth/login');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15457927292780544, '2023-08-03 15:44:17.064022', '2023-08-03 15:44:17.064022', '15457927204700160', 'get', '/menu/alloc/interface/list');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (15694607618670592, '2023-08-04 07:24:46.050301', '2023-08-04 07:24:46.050301', '15694607522201600', 'get', '/role/page');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (16006303855935488, '2023-08-05 04:03:20.224720', '2023-08-05 04:03:20.224720', '15459106626207744', 'get', '/menu/page');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (16006303855935489, '2023-08-05 04:03:20.224720', '2023-08-05 04:03:20.224720', '15459106626207744', 'get', '/menu/alloc/interface/list');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (16006303855935490, '2023-08-05 04:03:20.224720', '2023-08-05 04:03:20.224720', '15459106626207744', 'get', '/menu/children');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (19977176891785216, '2023-08-16 03:02:10.130446', '2023-08-16 03:02:10.130446', '19977176791121920', 'post', '/menu/');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260288, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'post', '/user/send/email/captcha');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260289, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'get', '/user/page');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260290, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'post', '/user/');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260291, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'put', '/user/');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260292, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'delete', '/user/:id');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260293, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'get', '/user/:id');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260294, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'post', '/role/alloc/menu');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260295, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'get', '/role/menu/list');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260296, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'get', '/role/page');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260297, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'get', '/role/list');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260298, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'post', '/role/');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260299, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'put', '/role/');
INSERT INTO `sys_menu_api` (`id`, `createDate`, `updateDate`, `menuId`, `method`, `path`) VALUES (198248133493260300, '2024-12-20 01:27:18.301205', '2024-12-20 01:27:18.301205', '19974159782117376', 'delete', '/role/:id');
COMMIT;

-- ----------------------------
-- Table structure for sys_menu_interface
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_interface`;
CREATE TABLE `sys_menu_interface` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `method` varchar(255) NOT NULL COMMENT '请求方式',
  `path` varchar(255) NOT NULL COMMENT 'path',
  `menuId` varchar(255) NOT NULL COMMENT '菜单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_menu_interface
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_menu_version
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_version`;
CREATE TABLE `sys_menu_version` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `menuId` varchar(255) NOT NULL COMMENT '菜单id',
  `version` varchar(255) NOT NULL COMMENT '版本号',
  `description` varchar(255) NOT NULL COMMENT '版本描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_menu_version
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu_version` (`id`, `createDate`, `updateDate`, `menuId`, `version`, `description`) VALUES (65717876044070912, '2023-12-20 08:19:22.630776', '2023-12-20 08:19:22.630776', '65717875960184832', 'v1.0.0', '低代码页面默认版本');
INSERT INTO `sys_menu_version` (`id`, `createDate`, `updateDate`, `menuId`, `version`, `description`) VALUES (65781470744018944, '2023-12-20 12:32:04.789701', '2023-12-20 12:32:04.789701', '65781470651744256', 'v1.0.0', '初始化');
INSERT INTO `sys_menu_version` (`id`, `createDate`, `updateDate`, `menuId`, `version`, `description`) VALUES (65793132637192192, '2023-12-20 13:18:25.202998', '2023-12-20 13:28:17.784000', '65717875960184832', 'v1.1.0', '555');
INSERT INTO `sys_menu_version` (`id`, `createDate`, `updateDate`, `menuId`, `version`, `description`) VALUES (65838647378706432, '2023-12-20 16:19:16.771475', '2023-12-30 14:41:15.349000', '65781470651744256', 'v1.0.1', '44444');
INSERT INTO `sys_menu_version` (`id`, `createDate`, `updateDate`, `menuId`, `version`, `description`) VALUES (69438375970471936, '2023-12-30 14:43:18.937399', '2023-12-30 14:43:18.937399', '65781470651744256', 'v1.0.2', 'helllo');
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `code` varchar(255) NOT NULL COMMENT '代码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` (`id`, `createDate`, `updateDate`, `name`, `code`) VALUES (1637123031564288, '2023-06-26 12:25:20.552134', '2023-07-07 09:57:48.000000', '管理员', 'admin');
INSERT INTO `sys_role` (`id`, `createDate`, `updateDate`, `name`, `code`) VALUES (5126498239381504, '2023-07-06 03:30:52.433074', '2023-07-06 03:30:52.433074', '用户', 'user');
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `roleId` varchar(255) NOT NULL COMMENT '角色id',
  `menuId` varchar(255) NOT NULL COMMENT '菜单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (4942175754256384, '2023-07-05 15:18:26.524235', '2023-07-05 15:18:26.524235', '', '');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (4942175754256385, '2023-07-05 15:18:26.537723', '2023-07-05 15:18:26.537723', '', '');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (4942175754256386, '2023-07-05 15:18:26.549777', '2023-07-05 15:18:26.549777', '', '');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (4942175754256387, '2023-07-05 15:18:26.557391', '2023-07-05 15:18:26.557391', '', '');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (4942175754256388, '2023-07-05 15:18:26.568274', '2023-07-05 15:18:26.568274', '', '');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (4942175754256389, '2023-07-05 15:18:26.575179', '2023-07-05 15:18:26.575179', '', '');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (4942175754256390, '2023-07-05 15:18:26.584043', '2023-07-05 15:18:26.584043', '', '');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (193025077275525120, '2024-12-05 15:32:44.657284', '2024-12-05 15:32:44.657284', '5126498239381504', '4237535672795136');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (193025077275525121, '2024-12-05 15:32:44.664540', '2024-12-05 15:32:44.664540', '5126498239381504', '2709189189173248');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333888, '2024-12-20 01:29:27.324543', '2024-12-20 01:29:27.324543', '1637123031564288', '5833057613381632');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333889, '2024-12-20 01:29:27.332978', '2024-12-20 01:29:27.332978', '1637123031564288', '5833177725665280');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333890, '2024-12-20 01:29:27.340075', '2024-12-20 01:29:27.340075', '1637123031564288', '5833499856601088');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333891, '2024-12-20 01:29:27.348778', '2024-12-20 01:29:27.348778', '1637123031564288', '6758078640816128');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333892, '2024-12-20 01:29:27.356849', '2024-12-20 01:29:27.356849', '1637123031564288', '6758006012248064');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333893, '2024-12-20 01:29:27.363054', '2024-12-20 01:29:27.363054', '1637123031564288', '6757857844264960');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333894, '2024-12-20 01:29:27.369660', '2024-12-20 01:29:27.369660', '1637123031564288', '6632374573989888');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333895, '2024-12-20 01:29:27.375271', '2024-12-20 01:29:27.375271', '1637123031564288', '5854701983629312');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333896, '2024-12-20 01:29:27.380915', '2024-12-20 01:29:27.380915', '1637123031564288', '5847213443907584');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333897, '2024-12-20 01:29:27.386480', '2024-12-20 01:29:27.386480', '1637123031564288', '15353796305616896');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333898, '2024-12-20 01:29:27.391401', '2024-12-20 01:29:27.391401', '1637123031564288', '61800856361631744');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333899, '2024-12-20 01:29:27.395029', '2024-12-20 01:29:27.395029', '1637123031564288', '61801171353862144');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333900, '2024-12-20 01:29:27.398962', '2024-12-20 01:29:27.398962', '1637123031564288', '1620378745044992');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333901, '2024-12-20 01:29:27.403058', '2024-12-20 01:29:27.403058', '1637123031564288', '197905447867383808');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333902, '2024-12-20 01:29:27.406664', '2024-12-20 01:29:27.406664', '1637123031564288', '9978851039903744');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333903, '2024-12-20 01:29:27.411504', '2024-12-20 01:29:27.411504', '1637123031564288', '2380054151561216');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333904, '2024-12-20 01:29:27.415679', '2024-12-20 01:29:27.415679', '1637123031564288', '19977176791121920');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333905, '2024-12-20 01:29:27.419600', '2024-12-20 01:29:27.419600', '1637123031564288', '15459106626207744');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333906, '2024-12-20 01:29:27.422825', '2024-12-20 01:29:27.422825', '1637123031564288', '15457927204700160');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333907, '2024-12-20 01:29:27.426395', '2024-12-20 01:29:27.426395', '1637123031564288', '2379818528145408');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333908, '2024-12-20 01:29:27.430222', '2024-12-20 01:29:27.430222', '1637123031564288', '15694607522201600');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333909, '2024-12-20 01:29:27.434213', '2024-12-20 01:29:27.434213', '1637123031564288', '1620785110188032');
INSERT INTO `sys_role_menu` (`id`, `createDate`, `updateDate`, `roleId`, `menuId`) VALUES (198248674663333910, '2024-12-20 01:29:27.437843', '2024-12-20 01:29:27.437843', '1637123031564288', '19974159782117376');
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userName` varchar(255) NOT NULL COMMENT '用户名称',
  `nickName` varchar(255) NOT NULL COMMENT '用户昵称',
  `phoneNumber` varchar(255) NOT NULL COMMENT '手机号',
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `sex` int DEFAULT NULL COMMENT '性别（0:女，1:男）',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `id` bigint NOT NULL COMMENT '主键',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` (`createDate`, `updateDate`, `userName`, `nickName`, `phoneNumber`, `email`, `sex`, `password`, `id`) VALUES ('2023-06-22 12:57:56.615603', '2023-06-28 13:34:36.735424', 'admin', '管理员', '1822222222', '1111@qq.com', NULL, '$2a$10$.OggYJaVe1OCLVSB/9wqk.bYYaSdvcHu7dcc0zpewfpzNKEDPh2Tu', 1);
INSERT INTO `sys_user` (`createDate`, `updateDate`, `userName`, `nickName`, `phoneNumber`, `email`, `sex`, `password`, `id`) VALUES ('2023-06-27 12:24:44.613815', '2024-12-24 09:20:07.000000', 'user', '用户', '18233333333', '876809592@qq.com', 1, '$2a$10$iXgB0nXbgde8tL3JMCAvCOe4kVQvvlslMJlM3FFl8vJiLCU68jPC6', 1999360162267136);
COMMIT;

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `id` bigint NOT NULL COMMENT '主键',
  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` varchar(255) NOT NULL COMMENT '用户id',
  `roleId` varchar(255) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (2002737659117569, '2023-06-28 13:35:03.172080', '2023-06-28 13:35:18.628752', '1', '1637123031564288');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (19414504450293760, '2023-08-14 13:46:18.577382', '2023-08-14 13:46:18.577382', '2', '5172863325700096');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192913264009543680, '2024-12-05 08:08:26.304738', '2024-12-05 08:08:26.304738', '192912926602952704', '5126498239381504');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192913264009543681, '2024-12-05 08:08:26.318492', '2024-12-05 08:08:26.318492', '192912926602952704', '5172863325700096');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192913264009543682, '2024-12-05 08:08:26.323715', '2024-12-05 08:08:26.323715', '192912926602952704', '1637123031564288');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192915356099018752, '2024-12-05 08:16:45.097451', '2024-12-05 08:16:45.097451', '192915355989966848', '5126498239381504');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192917256575909888, '2024-12-05 08:24:18.198893', '2024-12-05 08:24:18.198893', '192917256521383936', '5126498239381504');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192917894143672320, '2024-12-05 08:26:50.206814', '2024-12-05 08:26:50.206814', '192917894097534976', '159235485007347712');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192918652750659584, '2024-12-05 08:29:51.072174', '2024-12-05 08:29:51.072174', '192918652717105152', '5126498239381504');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (192918972348235776, '2024-12-05 08:31:07.271784', '2024-12-05 08:31:07.271784', '192918972302098432', '1637123031564288');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (193024765487742976, '2024-12-05 15:31:30.330377', '2024-12-05 15:31:30.330377', '192920448915210240', '5126498239381504');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (194640013567197184, '2024-12-10 02:29:55.473066', '2024-12-10 02:29:55.473066', '194640013529448448', '5126498239381504');
INSERT INTO `sys_user_role` (`id`, `createDate`, `updateDate`, `userId`, `roleId`) VALUES (199816674268938240, '2024-12-24 09:20:07.569774', '2024-12-24 09:20:07.569774', '1999360162267136', '5126498239381504');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
