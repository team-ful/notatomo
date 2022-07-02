import mysql from 'mysql2/promise';
import config from '../../config';
import {findCertByUserID} from '../../src/services/cert';
import {findUserByUserID} from '../../src/services/user';
import {createUserModel} from '../../src/tests/models';
import {TestUser} from '../../src/tests/user';
import {
  CreateAccountByPassword,
  CreateAccountBySSO,
} from '../../src/user/createAccount';
import {randomText} from '../../src/utils/random';

describe('cateiruSSO', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('新規作成', async () => {
    const userModel = createUserModel();

    const data = {
      name: 'テスト',
      preferred_username: userModel.user_name,
      email: userModel.mail,
      role: '',
      picture: 'https://example.com',
      id: randomText(32),
    };

    const ca = new CreateAccountBySSO(db, data);

    const user = await ca.login();

    const dbUser = await findUserByUserID(db, user.id);

    expect(dbUser).toEqual(user);
  });

  test('すでにログインしている場合はそのままユーザを返す', async () => {
    const user = new TestUser({
      avatar_url: randomText(10),
      display_name: randomText(10),
    });
    await user.create(db);
    await user.loginFromCateiruSSO(db);

    const data = {
      name: user.user?.display_name,
      preferred_username: user.user?.user_name,
      email: user.user?.mail,
      role: '',
      picture: user.user?.avatar_url,
      id: user.cateiruSSOId,
    };

    const ca = new CreateAccountBySSO(db, data);

    const loginUser = await ca.login();

    const dbUser = await findUserByUserID(db, user.user?.id || NaN);

    expect(user.user).toEqual(dbUser);
    expect(dbUser).toEqual(loginUser);
  });

  test('更新するものがある場合は更新する', async () => {
    const user = new TestUser({
      avatar_url: randomText(10),
      display_name: randomText(10),
      is_admin: false,
    });
    await user.create(db);
    await user.loginFromCateiruSSO(db);

    const data = {
      name: user.user?.display_name,
      preferred_username: randomText(10), // 変更
      email: user.user?.mail,
      role: 'noratomo', // 追加
      picture: randomText(10),
      id: user.cateiruSSOId,
    };

    const ca = new CreateAccountBySSO(db, data);

    const loginUser = await ca.login();

    const dbUser = await findUserByUserID(db, user.user?.id || NaN);

    expect(user.user).not.toEqual(dbUser);
    expect(dbUser).toEqual(loginUser);

    expect(dbUser.is_admin).toBeTruthy();
  });
});

describe('CreateAccountByPassword', () => {
  let db: mysql.Connection;

  beforeAll(async () => {
    db = await mysql.createConnection(config.db);
    await db.connect();
  });

  afterAll(async () => {
    await db.end();
  });

  test('新規作成', async () => {
    const dummy = createUserModel();
    const password = randomText(32);

    const ca = new CreateAccountByPassword(
      dummy.user_name,
      dummy.mail,
      password,
      '20',
      '0'
    );

    await ca.check(db);

    const user = await ca.create(db);

    const dbUser = await findUserByUserID(db, user.id);

    expect(dbUser).toEqual(user);

    const cert = await findCertByUserID(db, user.id);

    expect(cert.equalPassword(password)).toBeTruthy();
  });

  test('すでにメールアドレスが存在している場合はチェックが失敗する', async () => {
    const user = new TestUser();
    await user.create(db);

    const mail = user.user?.mail || '';
    const dummy = createUserModel();
    const password = randomText(32);

    const ca = new CreateAccountByPassword(
      dummy.user_name,
      mail,
      password,
      '20',
      '0'
    );

    expect(async () => {
      await ca.check(db);
    }).rejects.toThrow('user is already exists');
  });

  test('すでにユーザ名が存在する場合はチェックが失敗する', async () => {
    const user = new TestUser();
    await user.create(db);

    const userName = user.user?.user_name || '';
    const dummy = createUserModel();
    const password = randomText(32);

    const ca = new CreateAccountByPassword(
      userName,
      dummy.mail,
      password,
      '20',
      '0'
    );

    expect(async () => {
      await ca.check(db);
    }).rejects.toThrow('user is already exists');
  });

  // TODO: 他のチェックも書く
});