import { addCommand, listCommands } from "./commandManager";

addCommand({
    name:'ping',
    description: 'Responde com "pong"',
    execute:()=>'pong',
});

addCommand({
    name:'echo',
    description: 'Repete a mensagem que foi enviada',
    execute:(args:string[])=>(args.join('')),
});

addCommand({
    name:'help',
    description: 'Lista todos os comandos disponiveis',
    execute:()=>{
        return listCommands().map(
            command=> `${command.name}:${command.description}`
        ).join('\n');
    },
});