/**
 * Script to download all gallery images from the old Google Sites
 * Reads gallery image URLs from urls_all.txt and saves them to assets/gallery/
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Gallery image URLs (w1280 resolution images from lines 3-32 of urls_all.txt)
const galleryUrls = [
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRfsywFAvY59kqSSHtv2kJsgHYsxkuTrCAwz6E6TknrZVLm1o8b7fCJ6oIRu9XMtgd3fAN-oydFOHPRRGAuV4aF_IAcfIzXeZ6LEPc3gDzSwqj9JME24mIW1IDMuQHvMiR2Gbs8rL4jP9LQN1uukpnw1MM08BGJsLeMeSKsrrjotl3yp9hmyFWNTSDFNdqAAkUXIn1mjn1wBlqKGCUyBEFhlxYEhJgEO757=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSBjQl9CjliTvAzvP_RBUIDFZXq_WBvca09MOD06YU7QjZYIlNczJmIG4u6zD8OV5HXMMrzIZXue20VcG9mXlJSNyjYAHdVIOHVMTKMk1HubcY0OJoSZLl5wL_AiXkL3_-4lmEtCLpPcm_MnarCF3Jo8KykNQWQYOm9c2dUWxS3LK49s3jcHvYqm7CbABLnVubYYdyEcD6In_PFHwMxNttCB9CRM4fCAhwY=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRtHBDgjbgvJXqNl0zw4JOWqWyIT5ZzzxKdwBGRUjyQU8CZQl5y1mqSqbkpjZ_gWKBmhIEgF_UT2fMu3mdX57DYbBbCSVEo0saLgO6BcbnoQfrWFaX7PrfOUOKsTCr2aED7Ld59qV5GK4VTVC3R9CY-SRbFouGFUDBG5XPd6raX-ZkqxmQfUIcrx40LSIbHtRVD5LqJnTHs17y0CQRsBeXs38yEhUNpcyJPF9Y=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSvcFKBgHKhMM1fHT6iY3LRfdX9alK0zX0OyIpsjC7QFKKcAKxF1lfB8y1vs5-asWrGsPtfFPggMu50ir5-HmZUPwGCPPkLJQGeNmjnGXNIOSMXmV212L_RzMwXvOdFrBpWEMgAEH-n6Yfr4ny6luMzHZPG2uHrzNvcpIA0H3jvgvz4kv3eDdRvD0QsCeGVf5g7ulVAKHhxxl1AzffAYdtpeBp9PNdDHOynoH4=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSWjvV6sxbizBZ4oLUPV_HWFCEpfxow7IzuHGKYoFLSbA8iD3R4Pq9scxHi8xx6Lri2cPEhkeLj_dm44YJ3keLFnJWtEBr6kmal1_muxaj5ir6BiEDEBdcPX5iGXXQWqQXZD5nETU1ff8bDgEl2a0aPBk5ZvwCIUS0JTWRxwqwXpB_V9WylpWVqhiDCfMkwVPs2MQBTRaqaR71dosv1XisLuYcU4A_nwqIbPKE=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0ST_mSTaLlqSVaKMrXm-2dZRHW9iYf2cljkXOYqZ0MVyZih2ccIwRP7e0IrFgSZRBOlLZc1cRkDESv035qffilE4ZX-hEIGrKtcTZB_rcvLPzv4g_8JjeDXzRe98Kg7_RByVVZ9831OkR8y1MCxUm_knG51HFCDUNba2Y6BCYSFLjsrYOEqGc86CSX1QsARTFANbR0esU2uw2cUOG1s-b3RV4Bfo2sP8gElSo7Q=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRYrUfKK-gUJrq6GHL4ZJRJyPDqKS8KeAM1ZmqGTPCWgu4AaVQjJsN_PuC-n4FmrZQvwx7yNyKiLHkICv3Pcssu2S1CJJR7uVHMyNSqf5HfLeDBod-piblw0RJK2ophyLPKwmTibCryZxfDVpGtZGEsFmo7X7jxiVg06FsB7mg6o721aPlVHMEO-qZnNvV5pd8jWp1qVY5nam-pxQ3D2fpIbe5FI_0aBxwN=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRfv0WmPmRkYmzwg2ktd844tAwQiOCE5i4D9LiW9cVkM_ackMaqXkmgyjYPpJxz1SJsp6TLJEdwVDXaKZo-JHxq-N1SiX8NSDyTlBGbxswI7Qss9FMQjIOzA5c5_WjVG02_MUDFvGyYBIsjezXTxtr1pZp0qT9V-jyz9SdlKV5T2-qE8xDsqj9A_IN0sFQHqs95pywbwUEe3RheVVWYRDjcEtPFTqeTxN_yzxg=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SQ3xbd5haFBFrBdMcPSNFdLIg7cOVIzbkvUfcdt3ys3nliKiWj25-KxmuGLNDq_pj3mAgbS1gsJoXk7arnAsIC8fC_SqXDigz5gZ2nCrOXtqZkz66eoktYoffWmiu3-aG55GnjHUSTCEQqrYu1Y-1QaJQIoPlFnCNc1kte2JQMCR3B546-CE3oxmiCwta-9L3ZhcMH6ulcSmm57spJx2BScc0_OvD7llw5PvOo=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0ST1f7g3FaU0wDtQHZwena1JxbmJDE0BQjzHH56xO0TBVjkB1sjo4TMvnToYn0TJSQF5TnqZVSm4qL67z8xvc6SZ486YJ3NegI884CmRK4wbjDnSZocJV-ZNJkPRlCrFJuCnOOZe9nnh6IyXMupY5kvJXh6dCeUgF9ThPp9KrIjom8fttGczs37o6DH7pTdYU6GYdKuum_YqHhXMA9yk5d1lpOGUfjWPhFxjs9E=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0ST8_v3Q-s5m-rgJABL2Pp4lTNzyCzjxVbI5koSOjdiScPiI07hsYsWcqvPnuNqXixlw5EeGeNANqW1le5zcL0RdMh22588DPc8942rIrPXwnYj2KFB-kQs3lPjHUqelJ70zZgdPdZ57lDjwAkF4EupfI419L84SkzM2dgH8V2lAMqb7hFUSMdzC4Q6iCMlH_Ni8T3Lapb1KS_OxBN2PbwDKrNV8z5sdImY0u4Y=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSmjPTw1uu20TBvP508TzcaVxEX5gG7M82L6DcltBUTHG7uM7usDnhH9-5vG6ziophtpNSyMb3eW4ipEyR-TVfBMwOiU5UNnD1_RQtc948akO--cnydvIDG0n3GV1fQ4Uzr_EHNambERxqyFvrh6hRQzvX10jF3ABc_pdcdNch7TYWwAAFL0UC5UuLcw2uHGQ2uOMSm00IRW8JkoPUBrU_vg7LuGuZFmw_TLms=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSF2eSkJtB8U_SiGVQ2BsYCPWbifZvzFMxlhXqpO0QHQ60lTvxm_7ViGgXETi1J4KSEIQYyUCgdnUtWMbzP9vn725ldsOego8i2B7t1dTdeTU_eFH6njxQbecDA4mpi78uadbNDtleFcLEvu1ZutIsWfxVNIb7H5-JufwArEchUJ43j7qZmdGDdULfWqZG-E_p47Vh3cz10QWEAUibq9AGSZSStTXEX3H-H=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0ST1t55N7TA54oEAnOkDze9diI7vTNz3lFNnlwHNsRftrAOUNLIklZj4yhl_wn54RvaJq72pYJsKvDoxTdU_Vd64DWXzH2ZJKKbwKeu3EF8RCQN9eKgBrQIs5Xt9OM24Wk14_9vwY_si14ceZQterFGKne_-5DqpxL3iywI_xH8OgCdImgfzNXaa_ycOr5m1dbLFWuAado3CzqgzceKP4KI3hH-IaX-uI6S5zlU=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSHWbVXcyCirUTEQATfMcJs4otjKZygkiadyYdHVAkEfHNNLLUb6CkzhFSOhMEE4ALloqlaARAF3Avm5PRdk6nHI2FnWG0d-C6RK062WFUwWgWgi5g0L8k7hQltF5PFoZYmyWiQq-6-Rr_by2v-qaDqy4YH6FyN-_yFdMc9b19eMgjjzTm2BrpLXOCM4FyJrdruFFNJ14ulUAfhU2eDaJnF-cwIjkyIvjo3Wkc=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0STf6gHz_Wpxw19Vzuq_OFQoIePhMd9xwUOPI0i-ze5vZz-Ulq2giT6CCgMRdTewktt64hie7tr_j5oU-Z3o3jyhS5OGk9tRUZ2ozHmIdwIeGTsG3scT15daAnHlVRRek4OKpQQCzTHphQ2CMTjlWNx-gtgIFWeO14h6X5WK-JXgRd1A_vffxBwlV0xtFuoDlYekh6Fdpkq6xJizUHKCyR3iBLPpVC0IoKsnCMg=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SROGX8-BGiwVnIb1qrsVAjszm4GlFTRRkIeX9_4B_2et4QcEYfBX2RTVqe9It2c90gYhYqiiceGd3Dc9MvxF0f1Z20RwVzvd-N0wnrZ7TzuOSFxW1QfH7ifwZoU42YZ-manXM1zojkZg_AvAmaxO1fn-PCE6PIRspsanoCBaaJGCVkpCDhIG3oAjpbvdxx6gjNcmsmuCXXCknpIdFna6tRziCVYgt_ve4pp=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRlRz1B0Zp0gsqxRUxqBSArQ5_QV5xxuvsGRsHLyRKL6oawKk8BJa7ogmkKSeQIBq1OY54o3Qz-R52ZqEd3S4dZ_OWl-B8rmfZpI0UVonMcH1NfPSF_fHPtLtEpJQQj5BXhFds23JGwpXjXMjjp4Oh407FYK5AH7FKvU5oJRgiMIfuZ4HMD18vB_5WtaPucogpwHxHIda28m5IzUHarpxUaLpL-POhdd5-xNAU=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRt5GZQAc6iuqxWDJxWXIyf9LSkXLjKtDoGpL2tXN6iOHfShxa0dwGEbtqe8XIrDYfQHoTl4J7c-iagb_o0pfvymDB6cEC__jLH0R-LzxQhPs676L4CK-6k2qZPZRo3INprGVIUUxMjmntZuYgMRQi0330PG9OaNkgLdKeVOiR5fCQudq5lvbvS8Qj1OIi-9QWiQPL79cB3bgB_MDx6uMXkAStij1ypNZ2Z=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0STT9yzElc9eGVUw8Tb2gqtwM8gw_KxRd1kS6b089q54CX-TDsKwq_bydywZLLE15XzaqcUadE4_TTg4LUaUil36yMNneoSWbu0oSZRM9CutgyydWpyzc3lwE8skWVo5ez07740jPmubJf5CfpR6CHiaIUx-Sv1qr-AleUuUaHlsOXe0XJPsaICinAfcY3dX_MUmedSflbXQmVl0vMcE0c_df0HcKCzBR_Y2rPg=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SS8lkSbZk_zxPCP0HnqQwVivZrMTWjEjOuo6lBH9P6T_WbQ_qU9bvlSdyZWBbuRDIJZiWIVlgk8ZFk8LY6SjXGaX3FlFnQerwK6PF3zk4wlVm7Qqd63IDYdiPFysCaabYXzbkcouQ7X6IdRpEOpmZBmY1zGjZXD1rB0Hu_gs2jStcqLGjQQMPH9x1wtf2OL9q6rLPZWUF9CTcm449gUK_tIo_yUoQlLJpVom1M=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SQJFBQC47gwxUjA0pnJRu-1kyN_QDpAVl_1jW6bFYqzGXeCquX4BFf0EmyKbLOP-yzwAq63Zp1NOfmiX1qIPqbAUnudKIBsrsZpPClpALXtJFpe89PdllLWyT6R7XI3X2pSQsuYnZQLMih88VVMkWZFgv5fR85R-sBSCr9dL207gmRvrSvvgrbASnHAUxfX8-MI9M60bGIDnVU9j-7YS2eOTCBgaR2kUs4zC5k=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRUDEgLbP3nnG-Moq4nGSXnzWqMbrFfJSY9UZu6ul2wgn6c2tjgTahR6zXNSZLMOXX03u4DnU5oUZKekNUMOY4u52zE3HpHdtFx94g4wHFpf8HpiMWj3OsowEvcLjlUzK_-Zp-fUajDpyoUKoiFpberqzgyT5lFaa4d1X-vUGGie4sQOhmzoiBBscACO-A91smtZeWf92cfbfNrhVAfJWQUuHINXw_pNGA4=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0STZg5Y38uWfLcJhukQ6myQd4ts5w0rO95P5pSC9mCy3jz3MwP3wSUxCpmN53SbXN828Az4xy8VNivRCeJ24lOLj51PTFuDXYVvZ6edfY8Ox9mtnaIm9JQhXWltjnvs9CIB-QchCzlDIml5-_c33zB4Q-4EouCsOGzN6wtl7I91O3NYch0S8UKnwBFTUBoljG3oH3JHKGb4bpp-ihDKNmQkM-aCM2DypL5eGyCU=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0STfL6ogO8QHd5oJOBz3AzJN4fphZ9gzoMj7iOuPYkzR10C6M9zfJT5GBK-69B-vYaSfxxxreRHprlzaEu5dq8BH7bcvUYrI4YTdqENtyLcvi5go82Ob6jw-gCMyaPP4hggUyHqX3uIfHSot9ax3Il8VTtU1iUZqNdsFZh0ZjtylIhz4PaGGdRuMiianSV4uAGmRmMaLDrgRr2RUo7-xjymg9opjd572SVjW=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SQKNSDTv-TadAHsqppmqXUpv9EX0siF4lLjxxteepZwSkoI5cG_MgRoUj2qgpYKJX9LcgpwHjNdJtzPJtn8DB4y0Im4_8oRi7dCX20xGUUj4bNE74Re24nnabfi2V8tfeNWVkF3Q7oRIiHzaZ2RoppQ1nESATVgNvi6eneqStkWwIoUB9yPRNDHwaQjU1rRAupFSuK9HBW0SOV7hQ0zGJUYYbHsNB1IHajxJmA=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SQ8XSkLZ6qtGTcxAZjvHbwzMFxTJwgpIuwZ-r75DeA4t7JonZm2QL-FjckO0TPMP2ajU6LTmrwxntwr_MTcLz1eha3Z-Q42meAfD7IZStFg-fXoLBZ4rAToYA1P4D2I2ODeVch-Z3EKd4mMIywRgY3TJx8BQ1LWI729GzMAsNsNIusiLDTCUrOTsjI9ty7lrdUVd4oQyDNgaPvmzaGjfDOivni2qTiI9RCu468=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SRAfRYdOrK262c12qEAoTYxl3Np41_3HmlhyCYb-IMq1CGRdm1gy-Gcs3jOUX8ad_YrOOUi8SeQxAWHtxmx5mL431biDp3NlqxpT_sYCAlLxQHfcpUk5_DEbLfAMaGyA1GppnFDy9qRZwvySUjXYH7FP0uEWEV7BN8IgAFjklupvC6F_SqLeQecJA4DC3rxLz2MGIvuiYbxjVLIfoc2FgxvNXeKEL0sJVU2MK0=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0ST41DETy-fXq0Jpf54HAXzx6yoDe-zaALoXg-cQO_awG7TzrnEXzqLBGrUYgrkFBdkEli7q8wF2dp6TmvFd-8zpbdbAuueRH6oOUlqA6C2wyZB82ZxdxB3_UcUWjUWkHvGATqYw1YDQ6X-csb4OLT5MZ_zc41swXuMTakRn9rKDzl5OqmeVqpa1Q4DZWjrVp__KysqlK__P1zZnWIG3BNirWuM4ly3AizIKCEA=w1280',
  'https://lh3.googleusercontent.com/sitesv/APaQ0SSnnBoydxnJXRxUDQAyaSgMMAd_5K6VSxv0vXJzxaTNOXYcjzAdsMWjQ9jc82RSxLzkWQi8fUt-gYpUFKn_K7cjuhL1mtoB9tUY4wuDg8MQuKRLncBA0l1rOvxEYh2fR0pFAJDpJ3IhEG_3DdXL7kP_nvAzEHo76QRC2GXuqzGA4MkT-U9qrENLwAyLvqHO5-U1OdLr-HLgFBtUt5Gp4c2q2PzHgY170ZER=w1280',
];

const outputDir = path.join(__dirname, 'assets', 'gallery');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created directory: ${outputDir}`);
}

function downloadImage(imageUrl, index) {
  return new Promise((resolve, reject) => {
    const filename = `gallery-${String(index + 1).padStart(2, '0')}.jpg`;
    const filepath = path.join(outputDir, filename);

    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipping (exists): ${filename}`);
      return resolve(filepath);
    }

    const parsedUrl = new URL(imageUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const file = fs.createWriteStream(filepath);
    const request = protocol.get(imageUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadImage(response.headers.location, index).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        return reject(new Error(`HTTP ${response.statusCode} for image ${index + 1}`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve(filepath);
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(new Error(`Timeout for image ${index + 1}`));
    });
  });
}

async function downloadAll() {
  console.log(`\n🖼️  Starting download of ${galleryUrls.length} gallery images...\n`);
  let success = 0;
  let failed = 0;

  for (let i = 0; i < galleryUrls.length; i++) {
    try {
      await downloadImage(galleryUrls[i], i);
      success++;
    } catch (err) {
      console.error(`❌ Failed image ${i + 1}: ${err.message}`);
      failed++;
    }
    // Small delay to be polite to the server
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n📊 Done! ${success} downloaded, ${failed} failed.`);
  console.log(`📁 Images saved to: ${outputDir}`);

  // Generate the gallery HTML snippet
  const downloaded = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
  console.log(`\n📋 Found ${downloaded.length} images in gallery folder.`);
}

downloadAll().catch(console.error);
