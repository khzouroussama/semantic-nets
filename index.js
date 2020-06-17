#!/usr/bin/env node

const Concept = (label) => {
    return {
        label : label ,
        M : [false , false] ,
        setM(num){ 
            this.M[num-1] = true
        },
        getM(num) {
            return this.M[num-1]
        }
    }
}

const Relation = (strings = '' , concept1 , link , concept2) => {
    return {
        start : concept1 ,
        end : concept2 ,
        link : link ,
        show() {
            return `${this.start.label}(${this.start.M}) -${link}-> ${concept2.label}(${this.end.M})`
        } 
    }
}

const SNetwork = (relations) =>  {
    // private 
    const Marker = (num ,concept) => {
        let q = []
        q.push(concept) 
        concept.setM(num) 
        while(q.length) {
            concept_ = q.shift()
            relations
            .filter( relation => relation.link === `is a` && relation.end === concept_)
            .forEach ( relation => {
                relation.start.setM(num)
                q.push(relation.start)
            });
        }        
    }
    const getChildren = (concept) => 
        relations.filter( rel => rel.link !== `is a` && rel.start === concept)
    
    return {
        relations : relations ,
        getChildren : getChildren ,
        // === PARTIE I ===
        MarkerPropagation(strs = '' , start , link , end ) {
            Marker(1 ,start) 
            Marker(2 ,end) 
            let answer =
                this.relations.filter(rel => rel.link === link && rel.start.getM(1) && rel.end.getM(2)) 
            return !answer.length ? `No answer` : Array.from(answer , cnspt => cnspt.show()) ;
        } ,
        // === PARTIE II ===
        Inheritance(concept) {
            let q = []
            let res = []
            q.push(concept) 
            res = [...getChildren(concept)]
            while(q.length) {
                concept_ = q.shift()
                relations
                .filter( relation => relation.link === `is a` && relation.start === concept_)
                .forEach ( relation => {
                    q.push(relation.end)
                    res.push(... Array.from(getChildren(concept_) , 
                            r => Relation`${concept} ${r.link} ${r.end}` 
                        ))
                });
            }
            return res 
        }
        // === PARTIE III ===
        
    }
}

const animal = Concept(`animal`) 
const carnivor =  Concept(`carnivor`)
const herbivor =  Concept(`herbivor`)
const lion =  Concept(`lion`)
const chien =  Concept(`chien`)
const lapin =  Concept(`lapin`)



let SNET = SNetwork([
    Relation`${carnivor} ${'is a'} ${animal}` ,
    Relation`${herbivor} ${'is a'} ${animal}`,
    Relation`${lion} ${'is a'} ${carnivor}`,
    Relation`${lapin} ${'is a'} ${herbivor}` ,
    Relation`${carnivor} ${'mange'} ${lapin}` ,
])  

console.log(`=== PARTIE I ===`)
console.log(
    SNET.MarkerPropagation
        `Quell $ ${animal} ${'mange'} ${lapin}`
) 

console.log(`\n=== PARTIE II ===`)
SNET.Inheritance(lion).forEach(
    r => console.log(r.show())
)