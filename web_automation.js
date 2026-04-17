import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function WebAutomation(cupom, port) {
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${port}`,
    defaultViewport: null,
  });

  try {
    const pages = await browser.pages();
    const page = pages.find((p) => p.url().includes("shopee.com.br/checkout"));
    if (!page) throw new Error("A aba não foi encontrada");
    await page.bringToFront();

    console.log(`ShopeeBuy ${port} INICIADO.`);

    try {
      await page
        .locator('input[placeholder="Código do Cupom Shopee"]')
        .fill(cupom);
    } catch (err) {
      console.error("Erro ao preencher o campo do cupom.");
      return;
    }

    try {
      await page.locator("button[aria-label='botãoAplicar']").click();
    } catch (err) {
      console.error("Erro ao clicar no botão de aplicar cupom.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1250));

    try {
      await page.locator("button > span[aria-label='botão OK']").click();
    } catch (err) {
      console.error("Erro ao clicar no botão OK.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1250));
    
    try {
      const cupom = await page.$("h3 ::-p-text(Cupom de desconto)");
      if (!cupom) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await page
          .locator("div.uFatmV > div.fJ3ua1 > button > span ::-p-text(trocar)")
          .click();
        return;
      }
    } catch (err) {
      console.error("Erro ao achar desconto aplicado.");
      return;
    }

    try {
      await page.locator("button.stardust-button--primary").click();
    } catch (err) {
      console.error("Erro ao clicar no botão 'Fazer pedido'.");
      return;
    }
    return;
  } catch (err) {
    console.error("Erro ao processar a página:", err);
    return;
  }
}