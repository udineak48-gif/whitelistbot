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

/* ✅ LIST KEY DISINI */
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

/* ✅ SIMPAN KEY PER USER (ANTI SPAM DM) */
const userKey = new Map(); // userId -> key

client.once(Events.ClientReady, async () => {
  console.log("✅ Bot aktif sebagai " + client.user.tag);

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  await channel.send({
    content:
      "**Tekan tombol hijau tersebut lalu masukan username roblox kalian, perhatikan penulisan besar kecilnya**",
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claim")
          .setLabel("Scripts Free (Tekan Ini)")
          .setStyle(ButtonStyle.Success)
      ),
    ],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  // Klik tombol
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

  // Submit modal
  if (interaction.isModalSubmit() && interaction.customId === "modal_whitelist") {
    const username = interaction.fields.getTextInputValue("username").trim();

    // Kalau sudah pernah claim → jangan DM lagi
    if (userKey.has(interaction.user.id)) {
      const oldKey = userKey.get(interaction.user.id);
      return interaction.reply({
        ephemeral: true,
        content: `✅ Kamu sudah claim sebelumnya.\nKey kamu masih sama: **${oldKey}**\nCek DM lama ya.`,
      });
    }

    // Claim pertama kali → ambil 1 key
    if (keys.length === 0) {
      return interaction.reply({
        ephemeral: true,
        content: "❌ Key sudah habis, hubungi admin.",
      });
    }

    const key = keys.shift();
    userKey.set(interaction.user.id, key);

    const link = process.env.SCRIPT_URL; // ✅ link raw doang, anti double

    // DM: Promo atas, Key + Link bawah
    const dmText =
      `💬 Ini free pake aja, terima aja kalau ada kekurangan.\n` +
      `Kalau pengen gacor sung gaya, beli VIP murah nah ini harga nya:\n\n` +

      `📌 Harga Script:\n` +
      `💠 1 Hari — Rp 5.000\n` +
      `💠 7 Hari — Rp 20.000\n` +
      `💠 14 Hari — Rp 35.000\n` +
      `💠 30 Hari — Rp 60.000\n\n` +

      `✅ Langsung order VIP:\n` +
      `🎫 Create tiket\n` +
      `📩 Atau bisa PM owner\n` +
      `👑 Admin Dn\n\n` +

      `---------------------------------\n\n` +
      `✅ Username Roblox: **${username}**\n` +
      `🔑 Key: **${key}**\n` +
      `🔗 Link: ${link}`;

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

client.login(process.env.TOKEN);