import { Languages } from '../../../types/core.types';

export const generateEmailText = (lng: Languages, otp: string) => {
  if (lng === Languages.Ukrainian) {
    return `
    <p>Шановний(а) <strong>Користувачу</strong>,</p>
    <p>Ласкаво просимо до системи управління навчанням Vaytone!</p>
    <p>Ваш код підтвердження: <strong>${otp}</strong></p>
    <p>Будь ласка, скористайтеся цим кодом для завершення процесу реєстрації.</p>
    <p>Якщо у вас виникли питання або вам потрібна допомога, зв'яжіться з нами.</p>
    <p>З найкращими побажаннями,<br/>Команда Vaytone</p>
  `;
  }

  if (lng === Languages.English) {
    return `
    <p>Dear <strong>User</strong>,</p>
    <p>Welcome to Vaytone Learning Management System!</p>
    <p>Your confirmation code is: <strong>${otp}</strong></p>
    <p>Please use this code to complete your registration process.</p>
    <p>If you have any questions or need assistance, feel free to contact us.</p>
    <p>Best regards,<br/>The Vaytone Team</p>
  `;
  }
};
