const URL = "192.168.0.2/users";


// Поиск юзера по ID в таблице
async function checkUserInBd(id) {
  try {
    let res = await fetch(`${URL}/findById/${id}`);
    let user = await res.json();
    return user;
  } catch (error) {
    console.log("Ошибка при поиске пользователя". error);
  }
}

// Поиск юзера по реферальной ссылке в таблице
async function findUserByRef(ref) {
  try {
    let res = await fetch(`${URL}/findByRef/${ref}`);
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
module.exports = {
    addUserToSheet,
    checkUserInBd,
    findUserByRef,
    updateUserInfo,
  };
  