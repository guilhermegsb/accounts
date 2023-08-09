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
      else if (action === "Consultar Saldo") {
        pegarSaldodaConta();
      } else if (action === "Depositar") {
        depositar();
      } else if (action === "Sacar") {
        saque();
      } else if (action === "Sair") {
        sair();
      }
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

// funções de depositar
function depositar() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checarConta(accountName)) {
        return depositar();
      }

      inquirer
        .prompt([{ name: "amount", message: "Quanto você deseja depositar?" }])
        .then((answer) => {
          const amount = answer["amount"];

          adicionarMontante(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function checarConta(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Essa conta não existe, escolha outro nome!")
    );
    return false;
  }

  return true;
}

function adicionarMontante(accountName, amount) {
  const account = pegarConta(accountName);
  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
    return depositar();
  }

  account.balance = parseFloat(amount) + parseFloat(account.balance);
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(account),
    (err) => console.log(err)
  );
  console.log(
    chalk.green(
      `Foi depositado o valor de R$${amount} na sua conta ${accountName}!`
    )
  );
}

function pegarConta(accountName) {
  const contaJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(contaJSON);
}

// Funções de consultar valor

function pegarSaldodaConta() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checarConta(accountName)) {
        return pegarSaldodaConta();
      }

      const accountData = pegarConta(accountName);
      console.log(
        chalk.bgBlue.black(
          `Olá ${accountName} seu saldo atual é de R$${accountData.balance}`
        )
      );
      operation();
    })

    .catch((err) => console.log(err));
}

// funções de saque

function saque() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!checarConta(accountName)) {
        return saque();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja sacar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          removerDinheiro(accountName, amount);
        })
        .catch((err) => {
          console.log(err);
        });
    });
}

function removerDinheiro(accountName, amount) {
  const accountData = pegarConta(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
    return saque();
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black("Valor indisponivel na conta!"));
    return saque();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => {
      console.log(err);
    }
  );

  console.log(
    chalk.green(
      `A conta de ${accountName} acabou de realizar um saque de R$${amount}, seu novo saldo atual é R$${accountData.balance}`
    )
  );
}
