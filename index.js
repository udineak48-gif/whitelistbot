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

/* ✅ LIST KEY */
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

/* ✅ BACKUP KEY (AUTO RESET BIAR GAK HABIS) */
const backupKeys = [...keys];

/* ✅ SIMPAN KEY PER USER */
const userKey = new Map();

client.once(Events.ClientReady, async () => {
  console.log("✅ Bot aktif sebagai " + client.user.tag);

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  /* ✅ ANTI DOBEL: Hapus pesan bot lama */
  try {
    const msgs = await channel.messages.fetch({ limit: 20 });
    msgs.forEach((m) => {
      if (m.author.id === client.user.id) m.delete().catch(() => {});
    });
  } catch (e) {}

  /* ✅ Kirim tombol FREE + VIP */
  await channel.send({
    content:
      "**Tekan tombol hijau untuk claim Script Free.\nKalau mau VIP lebih gacor, klik tombol Order VIP.**",
    components: [
      new ActionRowBuilder().addComponents(
        // ✅ FREE CLAIM
        new ButtonBuilder()
          .setCustomId("claim")
          .setLabel("✅ Scripts Free (Tekan Ini)")
          .setStyle(ButtonStyle.Success),

        // ✅ ORDER VIP LINK
        new ButtonBuilder()
          .setLabel("💰 Order VIP")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/LINKVIPLU") // 🔥 GANTI LINK VIP LU
      ),
    ],
  });
});

/* ✅ INTERACTION */
client.on(Events.InteractionCreate, async (interaction) => {
  /* ✅ Klik tombol FREE */
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

  /* ✅ Submit Modal */
  if (interaction.isModalSubmit() && interaction.customId === "modal_whitelist") {
    const username = interaction.fields.getTextInputValue("username").trim();

    /* ✅ Kalau sudah pernah claim */
    if (userKey.has(interaction.user.id)) {
      const oldKey = userKey.get(interaction.user.id);
      return interaction.reply({
        ephemeral: true,
        content: `✅ Kamu sudah claim sebelumnya.\nKey kamu: **${oldKey}**\nCek DM lama ya.`,
      });
    }

    /* ✅ Kalau key habis → reset ulang */
    if (keys.length === 0) {
      keys = [...backupKeys];
    }

    /* ✅ Ambil key */
    const key = keys.shift();
    userKey.set(interaction.user.id, key);

    const link = process.env.SCRIPT_URL;

    /* ✅ DM Text */
    const dmText =
      `💬 Ini free, pakai aja.\n\n` +
      `Kalau mau versi VIP (lebih gacor) bisa order ya:\n\n` +
      `📌 Harga VIP Script:\n` +
      `💠 1 Hari — Rp 5.000\n` +
      `💠 7 Hari — Rp 20.000\n` +
      `💠 14 Hari — Rp 35.000\n` +
      `💠 30 Hari — Rp 60.000\n\n` +
      `💰 Order VIP:\n` +
      `https://discord.com/channels/1450477024257769597/1466188664215437329` + // 🔥 GANTI LINK VIP
      `---------------------------------\n\n` +
      `✅ Username Roblox: **${username}**\n` +
      `🔑 Key: **${key}**\n` +
      `🔗 Script Link: ${link}`;

    /* ✅ Kirim DM */
    try {
      await interaction.user.send({ content: dmText });
      return interaction.reply({
        ephemeral: true,
        content: "✅ Sudah terkirim ke DM kamu. Cek inbox!",
      });
    } catch (err) {
      return interaction.reply({
        ephemeral: true,
        content:
          `❌ DM kamu tertutup.\nIni key kamu: **${key}**\n` +
          `Nyalakan DM: Privacy Settings → Allow Direct Messages.`,
      });
    }
  }
});

/* ✅ LOGIN */
client.login(process.env.DISCORD_TOKEN);
