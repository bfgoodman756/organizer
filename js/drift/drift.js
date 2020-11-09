let driftWrapper = document.querySelector(".drift-wrapper");
// let driftData = JSON.parse(localStorage.getItem("driftData"));

let driftData = JSON.parse(driftDataJSON);

let driftDataS = {
    rdsGp: {
        years: {
            2017: {
                info: {
                    stagesCount: 7,
                    participants: [],
                },
            },
            2018: {
                info: {
                    stagesCount: 7,
                    participants: [],
                },
            },
            2019: {
                info: {
                    stagesCount: 6,
                    participants: [],
                },
            },
            2020: {
                info: {
                    stagesCount: 6,
                    participants: [],
                },
                stages: {
                    moscowCup: {
                        country: "Russia",
                        place: "Москва",
                        trackName: "Moscow Raceway",
                        date: "11-12.07.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    1: {
                        country: "Russia",
                        place: "Рязань",
                        trackName: "Atron Circuit",
                        date: "25-26.07.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    2: {
                        country: "Russia",
                        place: "Нижний Новгород",
                        trackName: "NRing",
                        date: "8-9.08.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    3: {
                        country: "Russia",
                        place: "Санкт-Петербург",
                        trackName: "Igora Drive",
                        date: "29-30.08.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    4: {
                        country: "Russia",
                        place: "Москва",
                        trackName: "ADM Raceway",
                        date: "12-13.09.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    5: {
                        country: "Russia",
                        place: "Рязань",
                        trackName: "Atron Circuit",
                        date: "26-27.09.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    6: {
                        country: "Russia",
                        place: "Сочи",
                        trackName: "Sochi Autodrom",
                        date: "17-18.10.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },
                }
            },
        },
    },

    driftMasters: {},
    
    formulaDrift: {
        years: {
            2017: {
                info: {
                    stagesCount: 7,
                    participants: [],
                },
            },
            2018: {
                info: {
                    stagesCount: 7,
                    participants: [],
                },
            },
            2019: {
                info: {
                    stagesCount: 6,
                    participants: [],
                },
            },
            2020: {
                info: {
                    stagesCount: 8,
                    participants: [],
                },
                stages: {
                    1: {
                        country: "USA",
                        place: "St. Louis, Missouri",
                        trackName: "World Wide Technology Raceway",
                        date: "05.09.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    2: {
                        country: "USA",
                        place: "St. Louis, Missouri",
                        trackName: "World Wide Technology Raceway",
                        date: "06.09.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    3: {
                        country: "USA",
                        place: "Monroe, Washington",
                        trackName: "Texas Motor Speedway",
                        date: "26.09.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    4: {
                        country: "USA",
                        place: "Monroe, Washington",
                        trackName: "Texas Motor Speedway",
                        date: "27.09.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    5: {
                        country: "USA",
                        place: "Dallas, Texas",
                        trackName: "Texas Motor Speedway",
                        date: "31.10.2020",
                        participants: [],
                        averageTrackConfigTime: 19,
                    },

                    6: {
                        country: "USA",
                        place: "Dallas, Texas",
                        trackName: "Texas Motor Speedway",
                        date: "01.11.2020",
                        participants: ["Fredric Aasbo", "Adam LZ", "Taylor Hull", "Jeff Jones", "Vaughn Gittin Jr", "Chris Forsberg", "Ryan Tuerck", "Jonathan Nerren", "Chelsea DeNofa", "Dean Kearney", "Aurimas Bakchis", "Matt Field", "Kazuya Taguchi", "Daijiro Yoshihara", "Michael Essa", "Jhonnattan Castro", "Justin Pawlak", "Dylan Hughes", "Wataru Masuyama", "Dan Burkett", "Ken Gushi", "Travis Reeder", "Ryan Litteral", "Rome Charpentier", "Faruk Kugay", "Tyler Nelson", "Kyle Mohan"],
                        averageTrackConfigTime: 19,
                    },

                    7: {
                        country: "USA",
                        place: "Irwindale, California",
                        trackName: "Irwindale Speedway",
                        date: "21.11.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },

                    8: {
                        country: "USA",
                        place: "Irwindale, California",
                        trackName: "Irwindale Speedway",
                        date: "22.11.2020",
                        participants: [],
                        averageTrackConfigTime: null,
                    },
                }
            },
        },
    },
};


// let stage6Pilots = Object.entries(stage6).filter(person => person[1].q1 !== 0 || person[1].q2 !== 0);
//
// let data2017 = [],
//     data2018 = [],
//     data2019 = [],
//     data2020 = [];

let tableYear = 2020;

// createTable(tableYear,"rdsGp");

function updateRacePositions(stagePilots, year = 2020, series = "rdsGp", stage = 6) {
//     stagePilots = stage6Pilots;
    stagePilots.forEach(person=> {
        let fullName = person[0];
        let qualPosition = parseInt(person[1].qPosition);
        let racePosition = parseInt(person[1].racePosition);

        let champQualPoints = driftDataManager.getChampPTSForQualPosition(qualPosition);
        let champRacePoints = driftDataManager.getChampPTSForRacePosition(racePosition);
        let stageChampPoints = champQualPoints + champRacePoints;
        
        driftData.names[fullName].years[year][series].stages[stage].race.position = racePosition;
        driftData.names[fullName].years[year][series].stages[stage].race.stageTotalChampPoints = stageChampPoints;
    });
    PDOtoLS();
}


function runRacePositions() {
    driftDataManager.fillRaceRuslts(fullName, qPosition, racePosition, 2020, "rdsGp", 6);
}


let driftDataManager = {
    initializeCalcQualificationData: function(dataObj) {//data = s6
        let qualificationSortedPositions = sortQualificationPositions(dataObj);
        
        Object.keys(dataObj).forEach(fullName => setEachQualificationPosition(fullName, dataObj, qualificationSortedPositions));

        stage6 = Object.entries(dataObj).sort((a,b) => b[1].qualificationBest - a[1].qualificationBest);
        stage6 = Object.fromEntries(stage6);
        copy(stage6);

        this.markStageMissedPilots(2020, "rdsGp", 6);
        PDOtoLS();
    },



    sortQualificationPositions: function(stageParticipantsNames) {
        stageParticipantsNames = Object.keys(stageParticipantsNames).sort((a,b) => {
            let qBestA = Math.max(data[a].q1, data[a].q2);
            let qBestB = Math.max(data[b].q1, data[b].q2);

            if (qBestB-qBestA === 0) {
                let b1 = data[b].q1;
                let b2 = data[b].q2;

                let a1 = data[a].q1;
                let a2 = data[a].q1;

                return (b1+b2) - (a1+a2) > 0 ? 1 : -1;
            } else {
                return qBestB-qBestA > 0 ? 1 : -1; 
            }
        });

        stageParticipantsNames.unshift("zero-index-holder");

        return stageParticipantsNames;
    },



    setEachQualificationPosition: function(fullName, data, sortedParticipants) {
        let q1 = data[fullName].q1;
        let q2 = data[fullName].q2;
        let qBest = Math.max(q1, q2);
        let qualificationPosition = participants.indexOf(fullName);

        this.fillQualificationResults(fullName, q1,q2, qBest, qualificationPosition, 2020, "rdsGp", 6);

        stage6[fullName].qPosition = qualificationPosition;
        stage6[fullName].qBest = qBest;
    },



    fillRaceRuslts: function(fullName, qPosition, racePosition, year = 2020, series = "rdsGp", stageNum = 6){
        let stagePointsForQualification = this.getChampPTSForQualPosition(fullName, qPosition, year, series, stageNum);
        let racePoints = this.getChampPTSForRacePosition(fullName, racePosition, year, series, stageNum);
        let totalStagePoints = stagePointsForQualification + racePoints;
        driftData.names[fullName].years[year][series].stages[stage].race.stageTotalChampPoints = totalStagePoints;
    },



    fillQualificationResults: function(fullName, q1,q2, qBest, qPosition, year, series, stageNum) {
        if (!driftData.names[fullName]) {
            let ask = confirm("This person does not exist, do you want to create one?");
            
            if (ask) {
               this.addPerson(fullName) 
            } else {
                return
            }
        }

        this.checkIsEverythingFilled(fullName, year, series, stageNum);

        q1 = parseInt(q1);
        q2 = parseInt(q2);

        let stagePointsForQualification,
            racePoints,
            racePosition,
            totalStagePoints;

        let isQualificationFailed = qBest === 0;

        if (!isQualificationFailed) {
            racePosition = 32;
            stagePointsForQualification = this.getChampPTSForQualPosition(qPosition);
            racePoints = this.getChampPTSForRacePosition(racePosition);
            totalStagePoints = stagePointsForQualification + racePoints;
        }

        qualificationData = {
            first: q1,
            second: q2,
            best: qBest,
            position: qPosition,
            isFailed: isQualificationFailed,
        };
              
        if (isQualificationFailed) {
            driftData.names[fullName].years[year][series].stages[stageNum] = {
                qualification: qualificationData,
                race: {stageTotalChampPoints: 0},
                statistics: {
                    falseStarts: null,
                    kissTheWalls: null,
                    technicalFailure: null,
                    fatalMistakes:  {
                        crashSelf: null,
                        spinnedOut: null,
                        straightening: null,
                        offTheTrack: null,
                        oppositeDrift: null,
                        malfunction: null,
                    }
                }
            };
        
        } else {
            driftData.names[fullName].years[year][series].stages[stageNum] = {
                qualification: qualificationData,
                race: {
                    position: racePosition,
                    stageTotalChampPoints: 0 + totalStagePoints,
                },

                statistics: {
                    oneMoreTimes: null,
                    falseStarts: null,
                    kissTheWalls: null,
                    contacts: null,
                    meachnicalFailure: null,
                    crashTandemVictim: null,
                    hitWins: null,
                    hitLuckyWins: null,
                    fatalMistakes:  {
                        crashTandemInitiator: null,
                        crashSelf: null,
                        spinnedOut: null,
                        straightening: null,
                        offTheTrack: null,
                        oppositeDrift: null,
                        unchasableRun: null,
                        malfunction: null,
                    },
                },
            };
        }
        console.log(`${fullName}: [gets ${stagePointsForQualification} for qualification]`);
        console.log(`${fullName}: [${driftData.names[fullName].years[year][series].stages[stageNum].race.stageTotalChampPoints} current race points for stage-${stageNum}]`);
    },



    getChampPTSForQualPosition: function(position) {
        position = parseInt(position);

        let gainedPoints;
        
        if (position >= 5 && position <= 6) {
            position = 5;
        } else if (position >= 7 && position <= 8) {
            position = 6;
        } else if (position >= 9 && position <= 12) {
            position = 7;
        } else if (position >= 13 && position <= 16) {
            position = 8;
        } else if (position >= 17 && position <= 24) {
            position = 9;
        } else if (position >= 25 && position <= 32) {
            position = 10;
        }

        switch(position) {
            case(1): {
                gainedPoints = 25;
                break;
            }
            case(2): {
                gainedPoints = 21;
                break;
            }
            case(3): {
                gainedPoints = 19;
                break;
            }
            case(4): {
                gainedPoints = 17;
                break;
            }
            case(5): {
                gainedPoints = 12;
                break;
            }
            case(6): {
                gainedPoints = 9;
                break;
            }
            case(7): {
                gainedPoints = 6;
                break;
            }
            case(8): {
                gainedPoints = 4;
                break;
            }
            case(9): {
                gainedPoints = 2;
                break;
            }
            case(10): {
                gainedPoints = 1;
                break;
            }
            case(11): {
                gainedPoints = 0;
                break;
            }

        }
        return gainedPoints;
    },

    

    getChampPTSForRacePosition: function(position) {
        position = parseInt(position);

        let gainedPoints;
        switch(position) {
            case(1): {
                gainedPoints = 210;
                break;
            }
            case(2): {
                gainedPoints = 185;
                break;
            }
            case(3): {
                gainedPoints = 160;
                break;
            }
            case(4): {
                gainedPoints = 135;
                break;
            }
            case(8): {
                gainedPoints = 110;
                break;
            }
            case(16): {
                gainedPoints = 80;
                break;
            }
            case(32): {
                gainedPoints = 40;
                break;
            }
            default: {
                alert("wrong position, acceptable only next: [1, 2, 3, 4, 8, 16, 32]");
                return;
            }
        }
        return gainedPoints;
    },



    checkIsEverythingFilled: function(fullName, year, series, stageNum) {
        if (!driftData.names[fullName].years) {
            driftData.names[fullName].years = {};
        }

        if (!driftData.names[fullName].years[year]) {
            driftData.names[fullName].years[year] = {};
        }

        if (!driftData.names[fullName].years[year][series]) {
            driftData.names[fullName].years[year][series] = {};
        }

        if (!driftData.names[fullName].years[year][series].stages) {
            driftData.names[fullName].years[year][series].stages = {};
            for (let i = 1; i < stageNum; i++) {
                driftData.names[fullName].years[year][series].stages[i] = "stageMissed";
            }
            driftData.names[fullName].years[year][series].stages[stageNum] = {};
        }

        if (!driftData.names[fullName].years[year][series].info) {
            driftData.names[fullName].years[year][series].info = {
                carsDriven: [""],
                team: "",
                carNumber: "",
                rivals: {
                    total: [],
                    wins: [],
                    losses: [],
                },
            }
        }
    },


    markStageMissedPilots: function(year, series, stage) {
        let participants = Object.keys(driftData.names);
        participants = participants.filter(pilot => driftData.names[pilot].years[year] &&
                                                    driftData.names[pilot].years[year][series] &&
                                                    driftData.names[pilot].years[year][series].stages[stage] !== "stageMissed" &&
                                                    driftData.names[pilot].years[year][series].stages[stage].qualification.best === "TBD");
        if (participants.length === 0) {
            return;
        }
        participants.forEach(person => driftData.names[person].years[year][series].stages[stage] = "stageMissed");
    },
    


    addPerson: function(fullName, year = prompt(`Set ${fullName}'s year:'`, 2020), series = prompt(`Set ${fullName}'s series:'`, "rdsGp"), carModel = prompt(`Set ${fullName}'s car:'`), carNumber = prompt(`Set ${fullName}'s car number:'`), team = prompt(`Set ${fullName}'s team:'`)) {
        let name = fullName.split(" ")[1] || "";
        let surname = fullName.split(" ")[0];

        driftData.names[fullName] = {};
        driftData.names[fullName].info = {
            firstname: name,
            surname: surname,
            fullName: fullName,
            midname: "",
            nickname: "",
            age: null,
            country: "",
            place: "",
            careerSince: null,
            carNumbers: carNumber,
            currentTeam: team,
            photoURL: "",
            socials: {},
            cars: {[year]: [carModel]},
            teams: {[year]: [team]},
            series: {[year]: [series]},

            careerStatistics: {
                achievements: {
                    championship : {
                        position: {
                            highest: null,
                            lowest: null,
                            average: null,
                            podiums: null,
                        },
                        points: {
                            highest: null,
                            lowest: null,
                            average: null,
                            totalEarned: null,
                        },
                    },
                    stage: {
                        race: {
                            points: {
                                highest: null,
                                lowest: null,
                                average: null,
                            },

                            position: {
                                highest: null,
                                lowest: null,
                                average: null,
                                podiums: null,
                            },   
                        },

                        qualification: {
                            score: {
                                highest: null,
                                lowest: null,
                                averageFirstScore: null,
                                averageSecondScore: null, 
                                averageBest: null,
                                averageBoth: null,
                            },
                            position: {
                                highest: null,
                                lowest: null,
                                average: null,
                            },
                        },
                    },
                },

                statistics: {
                    totalCrashes: null,
                    oneMoreTimes: null,
                    falseStarts: null,
                    kissTheWalls: null,
                    mechanicalFailure: null,
                    crashTandemVictim: null,
                    hitWins: null,
                    hitLuckyWins: null,
                    fatalMistakes:  {
                        contacts: null,
                        crashTandemInitiator: null,
                        crashSelf: null,
                        spinnedOut: null,
                        straightening: null,
                        offTheTrack: null,
                        oppositeDrift: null,
                        unchasableRun: null,
                        malfunction: null,
                    },
                    rivals: {
                        total: [],
                        wins: [],
                        losses: [],
                    },
                },
            },
        };
    }
};


function PDOBackupToLS() {
    localStorage.setItem("driftDataBackup", JSON.stringify(driftData));
    console.log(`driftDataBackup saved to localStorage`);
}


function PDOtoLS() {
    localStorage.setItem("driftData", JSON.stringify(driftData));
    console.log(`driftData saved to localStorage`);
}

function tableSortCLickListener(event) {
    let closestTh = event.target.closest("th");

    if (!closestTh) {
        return;
    }
    
    let dataset = closestTh.dataset.tableSort;
    if (!dataset) {
        return;
    }
    sortTable(closestTh, dataset)
}

function sortTable(th, dataset) {
    if (th.dataset.isSorted === true) {
        let ths = Array.from(document.querySelectorAll(`[class^=table-rds] > thead > tr > th`));
        ths.forEach(th=> delete th.removeAttribute("data-is-sorted"));
    }
    
    let tBody = document.querySelector("table > tbody");
    let trs = document.querySelectorAll("table > tbody > tr");
    trs = Array.from(trs);
//     trs.forEach(tr =>)
    
    let stage = parseInt(dataset[1]) || 0;
    let stages = document.querySelectorAll("th[colspan='6']");
    let cellType = dataset === "name" ||
                   dataset === "carNumber" ||
                   dataset === "carModel" ||
                   dataset === "totalPoints" ||
                   dataset === "totalPointsMinusWorst" ? dataset : dataset.slice(2);

    let shift = null;
    switch(cellType) {
        case("name"):
            shift = 1;
            break;
        case("carNumber"):
            shift = 2;
            break;
        case("carModel"):
            shift = 3;
            break;
        case("q1"):
            shift = 1;
            break;
        case("q2"):
            shift = 2;
            break;
        case("qbest"):
            shift = 3;
            break;
        case("qpos"):
            shift = 4;
            break;
        case("rpos"):
            shift = 5;
            break;
        case("rpts"):
            shift = 6;
            break;
        case("totalPoints"):
            shift = 3 + (stages.length * 6) + 1;
            break;
        case("totalPointsMinusWorst"):
            shift = 3 + (stages.length *6) + 2;
            break;
    }

    let cell = null;
    let ths = Array.from(document.querySelectorAll(`.table-rds-${tableYear} > thead > tr > th`));

    if (stage === 1) {
        cell = 3 + shift;
    } else if (stage === 0) {
        cell = shift;
    } else {
        stage--;
        cell = 3 + (stage * 6) + shift;
    }

    trs = trs.sort((a,b) => {
        let nA = [];
        let nB = [];

        Array.from(a.cells).forEach(td => td.classList.contains("table-stage-missed") ? nA.push(-1, -1, -1, -1, -1, -1) : nA.push(td.innerText));
        Array.from(b.cells).forEach(td => td.classList.contains("table-stage-missed") ? nB.push(-1, -1, -1, -1, -1, -1) : nB.push(td.innerText));

        if (th.dataset.isSorted !== "true") {
            
            if (cell === 1 || cell === 3) {
                return nB[cell].localeCompare(nA[cell]) - nA[cell].localeCompare(nB[cell]);
            }
            return nB[cell] - nA[cell];
        
        } else {
            
            if (cell === 1 || cell === 3) {
                return nA[cell].localeCompare(nB[cell]) - nB[cell].localeCompare(nA[cell]);
            }
            return nA[cell] - nB[cell];
        }
    });

    if (th.dataset.isSorted !== "true") {
        th.dataset.isSorted = "true";
    } else {
        delete th.dataset.isSorted;
    }
    
    let cellNumber = 1;
    
    trs.forEach(row => {
        row.cells[0].innerText = cellNumber + "";
        tBody.append(row);
        cellNumber++;
    });
}

function createTable(year, series, minusOne = false) {
    let start = Date.now();
    let stagesNum = driftData.series[series].years[year].info.stagesCount;
    let table = document.createElement("table");
    table.dataset.seasonYear = year;
    let tableHead = createHead(stagesNum);
    let tableBody = document.createElement("tbody");
    
//     updateRacePositions(stage6Pilots);
    
    table.className = `table-rds-${year}`;

    table.append(tableHead);
    table.append(tableBody);
    driftWrapper.append(table);

    let totalPilots = Object.keys(driftData.names).length;
    let pilots = Object.keys(driftData.names);
    let pilotsData = driftData.names;
    let count = 1;
    
    for (let i = 0; i < totalPilots; i++) {
        setTimeout(() => {
            let fullName = pilots[i];

            if (!pilotsData[fullName].years[year] || !pilotsData[fullName].years[year][series]) {
                return
            }

            let carNumber = pilotsData[fullName].years[year][series]["info"].carNumber;
            let car = pilotsData[fullName].years[year][series].info.carsDriven[0];
            let totalSeasonPoints = 0;
            let totalMinusOne = [];

            let stagesNum = Object.keys(pilotsData[fullName].years[year][series].stages).length;
            let tr = document.createElement("tr");

            tr.innerHTML += `<td>${count}</td>
                             <td>${fullName}</td>
                             <td>${carNumber}</td>
                             <td>${car}</td>`;

            for (let i = 1; i <= stagesNum; i++) {


                let stage = pilotsData[fullName].years[year][series].stages[i];

                if (stage === "stageMissed") {
                    tr.innerHTML += `<td colspan="6" class="table-stage-missed">stage missed</td>`;
//                     tr.innerHTML += `<td class="table-stage-missed">-</td>
//                                     <td class="table-stage-missed">-</td>
//                                     <td class="table-stage-missed">-</td>
//                                     <td class="table-stage-missed">-</td>
//                                     <td class="table-stage-missed">-</td>
//                                     <td class="table-stage-missed">-</td>`
                       totalMinusOne.push(0);
                       continue;
                }

                let q1 = stage.qualification.first === null ? "" : stage.qualification.first;
                let q2 = stage.qualification.second === null ? "" : stage.qualification.second;
                let qBest = stage.qualification.best === 0 ? "00" : stage.qualification.best;
                let qPos = stage.qualification.position || "";
                let rPos = stage.race.position || "";
                let totalPts = stage.qualification.isFailed === true && stage.race.stageTotalChampPoints === 0 ? 0 : stage.race.stageTotalChampPoints;

                totalSeasonPoints += totalPts === "TBD" ? 0 : totalPts;

                if (totalPts !== "TBD") {
                    totalMinusOne.push(totalPts);
                }


                if (qBest === "00" || totalPts === 0) {
                    tr.innerHTML += `<td class="table-qualification-failed">${q1}</td>
                                    <td class="table-qualification-failed">${q2}</td>
                                    <td class="table-qualification-failed">${qBest}</td>
                                    <td class="table-qualification-failed">${qPos}</td>
                                    <td class="table-qualification-failed">${rPos}</td>
                                    <td class="table-qualification-failed">${totalPts}</td>`
                } else {
                    tr.innerHTML += `<td>${q1}</td>
                                    <td>${q2}</td>
                                    <td>${qBest}</td>
                                    <td>${qPos}</td>
                                    <td>${rPos}</td>
                                    <td>${totalPts}</td>`; 
                }
            }

            totalMinusOne = totalMinusOne.map(score => typeof score === 'number' && isFinite(score) ? score : 0)
                                         .sort((a,b) => a - b)
                                         .splice(1)
                                         .reduce((acc, curr) => acc+curr);
            tr.innerHTML += `<td>${totalSeasonPoints}</td>
                             <td>${totalMinusOne}</td>`;

            tableBody.append(tr);

            count++;
        }, 0);
    }

    let end = Date.now();
    console.log(`[table creaton time: ${end-start}ms]`);

    function createHead(stagesNum) {
        let tHead = document.createElement("thead");

        let tr1 = `<tr><th colspan="100%">${year}-SEASON</th></tr>`;
        let tr2 = `<tr><th rowspan="3">#</th><th rowspan="3" data-table-sort="name">Name</th><th rowspan="3" data-table-sort="carNumber">Car№</th><th rowspan="3" data-table-sort="carModel">Car</th>`;
        let tr3 = `<tr>`;
        let tr4 = `<tr>`;
        let stagesHeader = "";
        let colgroup = `<col span="4" />`;
        for (let i = 1; i <= stagesNum; i++) {
            stagesHeader += `<th colspan="6">stage ${i}</th>`;
            tr3 += `<th colspan="4">qualification </th><th rowspan="2" data-table-sort="s${i}rpos"><span class="rotate">POSITION</span></th><th rowspan="2" data-table-sort="s${i}rpts"><span class="rotate">POINTS</span></th>`;
            tr4 += `<th data-table-sort="s${i}q1">1</th><th data-table-sort="s${i}q2">2</th><th data-table-sort="s${i}qbest"><span class="rotate">BEST</span></th><th data-table-sort="s${i}qpos"><span class="rotate">POS</span></th>`;
            i % 2 ? colgroup += `<col class="table-column-colored" span="6"/>` : colgroup += `<col class="table-column-colored-accent" span="6"/>`;
        }
        tr2 += stagesHeader + `<th rowspan="3" data-table-sort="totalPoints"><span class="rotate">TOTAL POINTS</span></th><th rowspan="3" data-table-sort="totalPointsMinusWorst"><span class="rotate">TOTAL POINTS<br>MINUS ONE WORST</span></th></tr>`;
        tr3 += `</tr>`;
        tr4 += `</tr>`;
        colgroup += `<col class="table-total-pts"/><col class="table-total-pts_minus-one-worst"/>`;
        table.innerHTML += colgroup;
        tHead.innerHTML = tr1 + tr2 + tr3 + tr4;
        return tHead;
    }
    return 1;
}


function renderResultsTable(series = "rdsGp", year = 2020) {
    // let driftWrapper = document.querySelector(".drift-wrapper");

//     switch(year) {
//         case(2017):
//             tableHTML = rds2017;
//             break;
//         case(2018):
//             tableHTML = rds2018;
//             break;
//         case(2019):
//             tableHTML = rds2019;
//             break;
//         case(2020):
//             tableHTML = rds2020;
//             break;
//     }

    highlightMenuSubItem(year);
    appManager.rememberLastUsedDriftYear(year);
    let existTable = Array.from(document.querySelectorAll("[class^=table-rds]"));
//         driftWrapper.innerHTML += tableHTML;
    if (existTable) {
        existTable.forEach(table => table.remove());
    }

    createTable(year,"rdsGp");

    let table = document.querySelector("[class^=table-rds]");
    table.addEventListener("click", tableSortCLickListener);

    let totalPointsMinusWorst = document.querySelector('[data-table-sort="totalPointsMinusWorst"]');
    if (totalPointsMinusWorst) {
        totalPointsMinusWorst.click();
    } else {
        document.querySelector('[data-table-sort="totalPoints"]').click();
    }
}