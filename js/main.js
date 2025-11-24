     //じゃんけん用のSCRIPTを書いてください



        const TOTAL_PLAYS_KEY = 'jankenTotalPlays';





        if (!localStorage.getItem(TOTAL_PLAYS_KEY)) {
            localStorage.setItem(TOTAL_PLAYS_KEY, 0);

        }



        // DOM要素を一度取得しておくと効率的です

        const pcHandsElement = document.querySelector('#pc_hands');
        const judgmentElement = document.querySelector('#judgment');
        const winCountElement = document.querySelector('#win_count');
        const lossCountElement = document.querySelector("#loss_count");
        const drawCountElement = document.querySelector('#draw_count');

        const gameHistoryElement = document.querySelector('#game_history');
        const totalPlaysElement = document.querySelector('#total_plays');

        const resetAllBtn = document.querySelector('#reset_all_btn');
        const customAlertElement = document.querySelector('#custom_alert');

        const guBtn = document.querySelector('#gu_btn');
        const choBtn = document.querySelector('#cho_btn');
        const parBtn = document.querySelector('#par_btn');





        // スコアと履歴の状態変数
        let winCount = 0;
        let lossCount = 0;
        let drawCount = 0;
        let history = [];
        const MAX_HISTORY = 10;



        /**
        * スコア表示を更新し、HTML要素に反映する関数     
        */

        function updateScoreDisplay() {

            winCountElement.textContent = winCount;
            lossCountElement.textContent = lossCount;
            drawCountElement.textContent = drawCount;

        }



        /**
        * 対戦履歴を更新し、HTMLリストとして表示する関数
        */

        function updateHistoryDisplay(playerHandText, pcHandText, resultText, resultClass) {

            // 新しい履歴アイテムのHTML文字列を作成
            const historyItemHTML = `<li>あなた: ${playerHandText} vs PC: ${pcHandText} → <span class="${resultClass}">${resultText}</span></li>`;

            // 配列の**先頭**に新しい結果を追加
            history.unshift(historyItemHTML);

            // 履歴を最大数に制限
            if (history.length > MAX_HISTORY) {
                history.pop();

            }

            // DOM要素のinnerHTMLを配列の内容全体で更新
            // 【学習ポイント：element.innerHTML を使った一括更新 (パフォーマンスが良い方法の1つ)】
            gameHistoryElement.innerHTML = history.join('');

        }





        function UpdateTotalPlays() {

            let totalPlays = parseInt(localStorage.getItem(TOTAL_PLAYS_KEY), 10);
            totalPlays++;

            totalPlaysElement.textContent = totalPlays;
            localStorage.setItem(TOTAL_PLAYS_KEY, totalPlays);

        }





        function resetAllScores() {

            // localStorageの値を0に設定
            localStorage.setItem(TOTAL_PLAYS_KEY, 0);

            // スコアと履歴の状態変数をリセット
            winCount = 0;
            lossCount = 0;
            drawCount = 0;

            history = [];

            // 画面の表示を更新
            updateScoreDisplay();
            totalPlaysElement.textContent = 0;
            gameHistoryElement.innerHTML = '';
            judgmentElement.textContent = "";
            judgmentElement.classList.remove("win", "loss", "draw");

            // alert("リセットしました。");

            showCustomAlert(); //アラートを表示する関数を呼び出す
        }

        function showCustomAlert() {
            // 画面に表示する (CSSの .show クラスを追加)
            customAlertElement.classList.add('show');

            // 【学習ポイント：setTimeout】
            // 5000ミリ秒 (5秒) 後に指定した処理を実行する
            setTimeout(() => {
                // 画面から非表示にする (CSSの .show クラスを削除)
                customAlertElement.classList.remove('show');
            }, 1000); // 5000ミリ秒 = 5秒
        }

        /**
        * じゃんけんのメインロジック関数        
        */

        function janken(playerHand) {

            UpdateTotalPlays();

            // プレイヤーの手のテキスト表現
            let playerHandText = "";
            if (playerHand === 1) { playerHandText = "グー"; }
            else if (playerHand === 2) { playerHandText = "チョキ"; }
            else if (playerHand === 3) { playerHandText = "パー"; }


            // PCの手の決定と表示
            const pcHand = Math.ceil(Math.random() * 3);
            let pcHandText = "";
            if (pcHand === 1) { pcHandText = "グー"; }
            else if (pcHand === 2) { pcHandText = "チョキ"; }
            else if (pcHand === 3) { pcHandText = "パー"; }
            pcHandsElement.textContent = pcHandText; // .text()の代替


            let resultText = "";
            let resultClass = "";



            // 勝敗判定とスコア更新

            if (playerHand === pcHand) {
                resultText = "あいこ！";
                resultClass = "draw";
                drawCount++;

            }

            else if (
                (playerHand === 1 && pcHand === 2) ||
                (playerHand === 2 && pcHand === 3) ||
                (playerHand === 3 && pcHand === 1)

            ) {
                resultText = "あなたの勝ち！";
                resultClass = "win";
                winCount++;

            }

            else {
                resultText = "あなたの負け！";
                resultClass = "loss";
                lossCount++;

            }


            // CSSクラスの動的切り替えと結果テキストの更新
            // 【学習ポイント：element.classList.remove() と element.classList.add()】
            judgmentElement.classList.remove("win", "loss", "draw");
            judgmentElement.classList.add(resultClass);
            judgmentElement.innerHTML = resultText; // .html()の代替

            // スコアと履歴表示を更新
            updateScoreDisplay();
            updateHistoryDisplay(playerHandText, pcHandText, resultText, resultClass);

        }





        document.addEventListener('keydown', (event) => {

            // 【学習ポイント：event.key によるキーの識別】

            const key = event.key.toLowerCase();
            let selectedHand = 0; // 1: グー, 2: チョキ, 3: パー
            let targetElement = null; // ハイライトする要素



            if (key === 'a') {
                selectedHand = 1; // グー
                targetElement = guBtn;

            } else if (key === 's') {
                selectedHand = 2; // チョキ
                targetElement = choBtn;

            } else if (key === 'd') {
                selectedHand = 3; // パー
                targetElement = parBtn;

            }



            if (selectedHand !== 0) {

                // じゃんけんのロジックを実行
                janken(selectedHand);

                // 【学習ポイント：setTimeout() を使った一時的なクラスの操作】
                // 押されたボタンに 'pressed' クラスを一時的に追加し、視覚フィードバックを与える
                if (targetElement) {
                    targetElement.classList.add('pressed');

                    // 0.1秒後に 'pressed' クラスを削除する
                    setTimeout(() => {
                        targetElement.classList.remove('pressed');
                    }, 100);

                }
            }
        });




        // 【イベントリスナーの設定】
        // ページ全体が読み込まれてから実行する処理
        window.addEventListener('DOMContentLoaded', () => {
            // イベントリスナーを追加
            // 【学習ポイント：element.addEventListener()】
            guBtn.addEventListener("click", () => janken(1));
            choBtn.addEventListener("click", () => janken(2));
            parBtn.addEventListener("click", () => janken(3));

            //リセットボタンにイベントリスナーを設定
            resetAllBtn.addEventListener("click", resetAllScores);

            // 初回表示
            updateScoreDisplay();
        });

        totalPlaysElement.textContent = localStorage.getItem(TOTAL_PLAYS_KEY);
