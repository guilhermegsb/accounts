import inquirer from "inquirer";
import chalk from "chalk";

import fs from "fs";

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];
      if (action === "Criar Conta") createAccount();
      else if (action === "Sair") sair();
    })
    .catch((err) => {
      console.log(err);
    });
}

// criar a conta

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      { name: "accountName", message: "Digite um nome para a sua conta:" },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      const contasPessoas = `accounts/${accountName}.json`;

      if (fs.existsSync(contasPessoas)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );
        buildAccount();
        return;
      } else {
        fs.writeFileSync(
          contasPessoas,
          '{"balance":0}',
          console.log(
            chalk.green("Parabéns, sua conta foi criada com sucesso!")
          ),
          operation(),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function sair() {
  console.log(
    chalk.bgBlue.black("Obrigado por usar o Account,Conta desconectada!")
  );
  process.exit();
}
