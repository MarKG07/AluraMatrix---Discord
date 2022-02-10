import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDI2NDE2NiwiZXhwIjoxOTU5ODQwMTY2fQ.jd46rbE2g-JYwUGLXrcRzlp7E5OSbRFOnsaYp5EgUis';
const SUPABASE_URL = 'https://clyhqnhseuwvmsvpnfzw.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function MensagensTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaTempoReal) => {
            adicionaMensagem(respostaTempoReal.new)
    })
    .subscribe();
};


export default function ChatPage() {
    // Sua lógica vai aqui
    //usuário
    //usuário digita e tecla enter
    //adicionar o texto na listagem

    //dev
    //campo criado
    //usar o onChange, useState, if pra saber se o último caractere é o Enter
    // ./Sua lógica vai aqui
    const roteamento = useRouter()
    const usuarioLogado = roteamento.query.username
    const [mensagem, SetMensagem] = React.useState('');
    const [listaMensagens, SetListaMensagens] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending:false}) //traz as msgs na ordem correta
            .then(({ data }) => {
                console.log('dados da consulta: ', data)
                SetListaMensagens(data);
            });
            MensagensTempoReal((novamsg) => {
                console.log("msg tempo real")

                SetListaMensagens((valorAtualLista) => {
                    return [
                        novamsg,
                        ...valorAtualLista
                    ]
                })
            });
    }, []); //executa quando o que tiver dentro do array mudar

    function handleNovaMensagem(novamsg) {
        const msgObjeto = {
            //id: listaMensagens.length + 1,
            de: usuarioLogado,
            mensagem: novamsg
        }
        supabaseClient
        .from('mensagens')
        .insert([
            msgObjeto
        ])
        .then(({data}) => {
            console.log('criando msg: ', data)
        
        })
        SetMensagem('');
    }
    
    // function handleNovaMensagem(novamsg) {
    //     const msgObjeto = {
    //         id: listaMensagens.length + 1,
    //         de: 'MarKG07',
    //         mensagem: novamsg
    //     }
    //     SetListaMensagens([
    //         msgObjeto,
    //         ...listaMensagens
    //     ])
    // }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '90%',
                    maxHeight: '95vh',
                    padding: '50px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaMensagens} />


                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                //console.log(event)
                                const valor = event.target.value;
                                SetMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault() //evita do enter descer no texarea
                                    //console.log(event)
                                    SetMensagem('') //esvazia o textarea dps do enter
                                    handleNovaMensagem(mensagem); //chama a função
                                }

                            }} //Verfica com detalhes as teclas que estão sendo clicadas
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker 
                            onStickerClick={(sticker) => {
                                console.log("clicou")
                                handleNovaMensagem(":sticker:" + sticker)
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: '100%',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }} >
                <Text variant='heading5'>
                    MatrixChat
                </Text>
                <Button
                    variant='secondary'
                    colorVariant='neutral'
                    label='Sair'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    {/* {listaMensagens.map((MsgAtual)=>{
                          return(
                              <li key={MsgAtual.id}>
                                  {MsgAtual.de}: {MsgAtual.mensagem}
                              </li>
                          )
                      })} */}
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagens) => {
                return (
                    <Text
                        key={mensagens.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagens.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagens.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagens.mensagem.startsWith(":sticker:")
                            ? (
                                <Image styleSheet={{
                                    maxWidth: '200px'  
                                }}
                                 src={mensagens.mensagem.replace(':sticker:', '')
                                    } />
                            )
                            : (
                                mensagens.mensagem
                            )
                        }
                    </Text>
                )
            })}

        </Box>
    )
}