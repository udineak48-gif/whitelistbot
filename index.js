require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

/* ✅ KEY FREE */
let keys = [
  "FREE-K9P2M",
  "FREE-ZX81L",
  "FREE-MN72Q",
  "FREE-PL09X",
  "FREE-QW88A",
  "FREE-19LMZ",
  "FREE-XP7AA",
  "FREE-0QWNM",
  "FREE-LA72P",
];

const backupKeys = [...keys];
const userKey = new Map();

client.once(Events.ClientReady, async () => {
  console.log("✅ Bot aktif sebagai " + client.user.tag);

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  /* ✅ HAPUS PESAN BOT LAMA */
  try {
    const msgs = await channel.messages.fetch({ limit: 20 });
    msgs.forEach((m) => {
      if (m.author.id === client.user.id) m.delete().catch(() => {});
    });
  } catch (e) {}

  /* ✅ KIRIM TOMBOL FREE + VIP */
  await channel.send({
    content:
      "**Tekan tombol hijau untuk claim Script Free.\nKalau mau VIP lebih gacor, klik tombol Order VIP.**",
    components: [
      new ActionRowBuilder().addComponents(
        // ✅ CLAIM FREE
        new ButtonBuilder()
          .setCustomId("claim")
          .setLabel("✅ Scripts Free (Tekan Ini)")
          .setStyle(ButtonStyle.Success),

        // ✅ ORDER VIP (GANTI LINK INI!)
        new ButtonBuilder()
          .setLabel("💰 Order VIP")
          .setStyle(ButtonStyle.Link)
         .setURL("https://discord.com/channels/1450477024257769597/1466188664215437329")
      ),
    ],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  /* ✅ BUTTON CLAIM */
  if (interaction.isButton() && interaction.customId === "claim") {
    const modal = new ModalBuilder()
      .setCustomId("modal_whitelist")
      .setTitle("Scripts Free");

    const input = new TextInputBuilder()
      .setCustomId("username")
      .setLabel("ID / Username Roblox")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));
    return interaction.showModal(modal);
  }

  /* ✅ SUBMIT MODAL */
  if (interaction.isModalSubmit() && interaction.customId === "modal_whitelist") {
    const username = interaction.fields.getTextInputValue("username").trim();

    /* ✅ SUDAH CLAIM */
    if (userKey.has(interaction.user.id)) {
      return interaction.reply({
        ephemeral: true,
        content: `✅ Kamu sudah claim sebelumnya.\nKey kamu: **${userKey.get(
          interaction.user.id
        )}**`,
      });
    }

    /* ✅ AUTO RESET KEY */
    if (keys.length === 0) keys = [...backupKeys];

    const key = keys.shift();
    userKey.set(interaction.user.id, key);

    const link = process.env.SCRIPT_URL;

    const dmText =
      `✅ Username Roblox: **${username}**\n` +
      `🔑 Key: **${key}**\n\n` +
      `🔗 Script Link: ${link}\n\n` +
      `💰 VIP Harga:\n` +
      `1 Hari Rp5.000\n7 Hari Rp20.000\n14 Hari Rp35.000\n30 Hari Rp60.000`;

    try {
      await interaction.user.send({ content: dmText });
      return interaction.reply({
        ephemeral: true,
        content: "✅ Sudah terkirim ke DM kamu!",
      });
    } catch (err) {
      return interaction.reply({
        ephemeral: true,
        content: `❌ DM kamu tertutup.\nKey kamu: **${key}**`,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
