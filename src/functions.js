const URL = "https://elonsusk.cloud/users";

// Поиск юзера по ID в таблице
async function checkUserInBd(id) {
  try {
    let res = await fetch(`${URL}/findById/${id}`);
    let user = await res.json();
    return user;
  } catch (error) {
    console.log("Ошибка при поиске пользователя".error);
  }
}

// Поиск юзера по реферальной ссылке в таблице
async function findUserByRef(ref) {
  try {
    let res = await get(`${URL}/findByRef/${ref}`);
    let data = await res.json();
    console.log("Пользователь найден успешно!");
    return data;
  } catch (error) {
    console.log("Ошибка при поиске пользователя", error);
  }
}

// Обновление данных юзера
async function updateUserInfo(user) {
  try {
    await fetch(`${URL}/update/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    console.log("апдетйт пользователя УСПЕШНО");
  } catch (error) {
    console.log("Ошибка при апдейте пользователя", error);
  }
}

// Добавление юзера в таблицу
async function addUserToSheet(body) {
  try {
    const res = await fetch(`${URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log("полученные данные при добавлнеии юзера");
  } catch (error) {
    console.log("ошибка при добавлении пользователя", error);
  }
}

async function findChat(id) {
  try {
    const data = await fetch(`https://elonsusk.cloud/chats/find/${id}`);
    const res = await data.json();
    return res;
  } catch (error) {
    console.log("ошибка при поиске чата", error);
  }
}

async function addChat(id) {
  try {
    await fetch("https://elonsusk.cloud/chats/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
  } catch (error) {
    console.log("ошибка при добавлении чата", error);
  }
}
module.exports = {
  addUserToSheet,
  checkUserInBd,
  findUserByRef,
  updateUserInfo,
  findChat, 
  addChat
};
